import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { inr } from '../../core/utils/price.utils';
import { categoryIconPath } from '../../core/utils/icon.utils';
import { manufacturerLogoPath, manufacturerLogoIsDark } from '../../core/utils/manufacturer.utils';
import { ThemeService } from '../../core/services/theme.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, Header, Footer],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private theme = inject(ThemeService);

  allProducts = signal<Product[]>([]);
  addedId = signal<number | null>(null);
  rowQty = signal<Record<number, number>>({});
  searchQuery = signal<string>('');
  categoryParam = signal<string>('');

  // Sort & view
  sortBy = signal<string>('relevance');
  viewMode = signal<'grid' | 'list'>('grid');

  // Pagination
  currentPage = signal<number>(1);
  readonly pageSize = PAGE_SIZE;

  // Sidebar filter state
  selectedManufacturers = signal<Set<string>>(new Set());
  selectedProductTypes = signal<Set<string>>(new Set());
  selectedMountingStyles = signal<Set<string>>(new Set());
  priceMin = signal<number>(0);
  priceMax = signal<number>(10000);
  inStockOnly = signal(false);
  rohsOnly = signal(false);

  // Collapsed sections
  collapsedSections: Record<string, boolean> = {};

  ngOnInit() {
    this.productService.getAll().subscribe(products => {
      this.allProducts.set(products);
      const prices = products.map(p => p.price);
      this.priceMax.set(Math.ceil(Math.max(...prices)));
    });

    this.route.params.subscribe(params => {
      this.categoryParam.set(params['category'] || '');
      this.currentPage.set(1);
    });

    this.route.queryParams.subscribe(qp => {
      this.searchQuery.set(qp['q'] || '');
      this.currentPage.set(1);
    });
  }

  // ── Filter options ─────────────────────────────────────────────────────────
  get manufacturers(): string[] {
    return [...new Set(this.allProducts().map(p => p.manufacturer))].sort();
  }

  get productTypes(): string[] {
    return [...new Set(this.allProducts().map(p => p.productType))].sort();
  }

  get mountingStyles(): string[] {
    return [...new Set(this.allProducts().map(p => p.mountingStyle))].sort();
  }

  get globalMaxPrice(): number {
    const prices = this.allProducts().map(p => p.price);
    return prices.length ? Math.ceil(Math.max(...prices)) : 150000;
  }

  get pageTitle(): string {
    if (this.searchQuery()) return `Search: "${this.searchQuery()}"`;
    if (this.categoryParam()) {
      return this.categoryParam()
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return 'All Products';
  }

  // ── Full filtered list (all pages) ────────────────────────────────────────
  get filteredProducts(): Product[] {
    let results = this.allProducts();

    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.manufacturerPartNumber.toLowerCase().includes(q) ||
        p.manufacturer.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q)
      );
    }

    if (this.selectedManufacturers().size > 0) {
      results = results.filter(p => this.selectedManufacturers().has(p.manufacturer));
    }

    if (this.selectedProductTypes().size > 0) {
      results = results.filter(p => this.selectedProductTypes().has(p.productType));
    }

    if (this.selectedMountingStyles().size > 0) {
      results = results.filter(p => this.selectedMountingStyles().has(p.mountingStyle));
    }

    if (this.inStockOnly()) {
      results = results.filter(p => p.availability > 0);
    }

    if (this.rohsOnly()) {
      results = results.filter(p => p.rohs);
    }

    const minInr = this.priceMin();
    const maxInr = this.priceMax();
    results = results.filter(p => {
      return p.price >= minInr && p.price <= maxInr;
    });

    return this.sortProducts(results);
  }

  // ── Pagination computed values ─────────────────────────────────────────────
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pagedProducts(): Product[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get showingFrom(): number {
    return this.filteredProducts.length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage() * this.pageSize, this.filteredProducts.length);
  }

  // Visible page numbers (max 7 shown, with ellipsis)
  get pageNumbers(): (number | '...')[] {
    const total = this.totalPages;
    const current = this.currentPage();
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  goToPage(page: number | '...') {
    if (page === '...' || page < 1 || page > this.totalPages) return;
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ── Sort ───────────────────────────────────────────────────────────────────
  sortProducts(products: Product[]): Product[] {
    switch (this.sortBy()) {
      case 'price-asc':    return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':   return [...products].sort((a, b) => b.price - a.price);
      case 'availability': return [...products].sort((a, b) => b.availability - a.availability);
      case 'name':         return [...products].sort((a, b) => a.title.localeCompare(b.title));
      default:             return products;
    }
  }

  // ── Filter toggles ─────────────────────────────────────────────────────────
  toggleManufacturer(mfr: string) {
    const s = new Set(this.selectedManufacturers());
    s.has(mfr) ? s.delete(mfr) : s.add(mfr);
    this.selectedManufacturers.set(s);
    this.currentPage.set(1);
  }

  toggleProductType(type: string) {
    const s = new Set(this.selectedProductTypes());
    s.has(type) ? s.delete(type) : s.add(type);
    this.selectedProductTypes.set(s);
    this.currentPage.set(1);
  }

  toggleMountingStyle(style: string) {
    const s = new Set(this.selectedMountingStyles());
    s.has(style) ? s.delete(style) : s.add(style);
    this.selectedMountingStyles.set(s);
    this.currentPage.set(1);
  }

  clearAllFilters() {
    this.selectedManufacturers.set(new Set());
    this.selectedProductTypes.set(new Set());
    this.selectedMountingStyles.set(new Set());
    this.inStockOnly.set(false);
    this.rohsOnly.set(false);
    this.priceMin.set(0);
    this.priceMax.set(this.globalMaxPrice);
    this.currentPage.set(1);
  }

  get activeFilterCount(): number {
    return this.selectedManufacturers().size +
           this.selectedProductTypes().size +
           this.selectedMountingStyles().size +
           (this.inStockOnly() ? 1 : 0) +
           (this.rohsOnly() ? 1 : 0);
  }

  toggleSection(section: string) {
    this.collapsedSections[section] = !this.collapsedSections[section];
  }

  isSectionCollapsed(section: string): boolean {
    return !!this.collapsedSections[section];
  }

  onSortChange() {
    this.currentPage.set(1);
  }

  // ── Cart ───────────────────────────────────────────────────────────────────
  getQty(productId: number): number {
    return this.rowQty()[productId] ?? 1;
  }

  setQty(productId: number, event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    this.rowQty.update(q => ({ ...q, [productId]: (!isNaN(val) && val >= 1) ? val : 1 }));
  }

  addToCart(product: Product, qty: number = 1) {
    this.cartService.add(product, qty);
    this.addedId.set(product.id);
    setTimeout(() => this.addedId.set(null), 1500);
  }

  // ── Formatting ─────────────────────────────────────────────────────────────
  formatPrice(p: Product): string {
    return inr(p.price);
  }

  categoryIcon(category: string): string {
    return categoryIconPath(category, this.theme.theme());
  }

  onImgError(event: Event, category: string) {
    (event.target as HTMLImageElement).src = this.categoryIcon(category);
  }

  manufacturerLogo(name: string): string | null {
    return manufacturerLogoPath(name);
  }

  manufacturerLogoDark(name: string): boolean {
    return manufacturerLogoIsDark(name);
  }

  formatAvail(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  }

  onPriceMinChange(event: Event) {
    const val = +(event.target as HTMLInputElement).value;
    if (val <= this.priceMax()) { this.priceMin.set(val); this.currentPage.set(1); }
  }

  onPriceMaxChange(event: Event) {
    const val = +(event.target as HTMLInputElement).value;
    if (val >= this.priceMin()) { this.priceMax.set(val); this.currentPage.set(1); }
  }
}
