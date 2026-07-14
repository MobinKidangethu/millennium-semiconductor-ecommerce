import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { inr } from '../../core/utils/price.utils';
import { BackorderBadge } from '../../shared/backorder-badge/backorder-badge';
import { MobileBackHeader } from '../shell/mobile-back-header';
import { MobileBottomNav } from '../shell/mobile-bottom-nav';
import { MobileFilterDrawer, MobileFilterState } from './mobile-filter-drawer';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-mobile-products',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, BackorderBadge, MobileBackHeader, MobileBottomNav, MobileFilterDrawer],
  template: `
    <app-mobile-back-header [title]="pageTitle()"></app-mobile-back-header>
    <div class="m-plist">
      <div class="m-plist__toolbar">
        <button class="m-plist__filter-btn" (click)="filterOpen.set(true)">
          ☰ Filter @if (activeFilterCount() > 0) { <span class="m-plist__badge">{{ activeFilterCount() }}</span> }
        </button>
        <select class="m-plist__sort" [(ngModel)]="sortBy" (ngModelChange)="currentPage.set(1)">
          <option value="relevance">Sort: Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="availability">Availability</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      @if (activeFilterCount() > 0) {
        <div class="m-plist__chips">
          @for (m of selectedManufacturers(); track m) {
            <button class="m-plist__chip" (click)="toggleManufacturer(m)">{{ m }} ✕</button>
          }
          @for (t of selectedProductTypes(); track t) {
            <button class="m-plist__chip" (click)="toggleProductType(t)">{{ t }} ✕</button>
          }
          @if (inStockOnly()) { <button class="m-plist__chip" (click)="inStockOnly.set(false)">In Stock ✕</button> }
          @if (rohsOnly()) { <button class="m-plist__chip" (click)="rohsOnly.set(false)">RoHS ✕</button> }
        </div>
      }

      <div class="m-plist__showing">Showing {{ showingFrom() }}-{{ showingTo() }} of {{ filteredProducts().length | number }} results</div>

      <div class="m-plist__grid">
        @for (p of pagedProducts(); track p.id) {
          <a [routerLink]="['/m/product', p.id]" class="m-plist__card">
            <div class="m-plist__img-wrap"><img [src]="p.image" [alt]="p.title" /></div>
            <div class="m-plist__mfr">{{ p.manufacturer }}</div>
            <div class="m-plist__desc">{{ p.title }}</div>
            <div class="m-plist__pn">PN: {{ p.manufacturerPartNumber }}</div>
            <app-backorder-badge [product]="p" [qty]="1"></app-backorder-badge>
            <div class="m-plist__price-row">
              <span class="m-plist__price">{{ formatPrice(p.price) }}</span>
            </div>
            <button class="m-plist__add" (click)="addToCart(p, $event)">Add to Cart</button>
          </a>
        }
      </div>

      @if (pagedProducts().length < filteredProducts().length) {
        <button class="m-plist__more" (click)="currentPage.set(currentPage() + 1)">Load More</button>
      }
    </div>
    <app-mobile-bottom-nav active="categories"></app-mobile-bottom-nav>

    @if (filterOpen()) {
      <app-mobile-filter-drawer
        [state]="filterState()"
        (close)="filterOpen.set(false)"
        (clearAll)="clearAllFilters()"
        (toggleInStock)="inStockOnly.set(!inStockOnly()); currentPage.set(1)"
        (toggleRohs)="rohsOnly.set(!rohsOnly()); currentPage.set(1)"
        (toggleManufacturer)="toggleManufacturer($event)"
        (toggleProductType)="toggleProductType($event)"
        (toggleMountingStyle)="toggleMountingStyle($event)"
        (priceMinChange)="priceMin.set($event); currentPage.set(1)"
        (priceMaxChange)="priceMax.set($event); currentPage.set(1)">
      </app-mobile-filter-drawer>
    }
  `,
  styles: [`
    .m-plist { background: #fff; padding: 16px; min-height: calc(100vh - 200px); }
    .m-plist__toolbar { display: flex; gap: 10px; margin-bottom: 12px; }
    .m-plist__filter-btn { flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 11px; font-size: 13.5px; font-weight: 700; background: #fff; color: #1a1a2e; position: relative; }
    .m-plist__badge { background: var(--color-primary, #70284e); color: #fff; font-size: 10px; border-radius: 999px; padding: 1px 6px; margin-left: 4px; }
    .m-plist__sort { flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 11px; font-size: 12.5px; font-weight: 600; background: #fff; color: #1a1a2e; }
    .m-plist__chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
    .m-plist__chip { background: #f0e5ec; color: var(--color-primary, #70284e); border: none; border-radius: 999px; padding: 6px 12px; font-size: 12px; font-weight: 600; }
    .m-plist__showing { font-size: 13px; color: #888; margin-bottom: 12px; }
    .m-plist__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .m-plist__card { background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 10px; text-decoration: none; color: inherit; display: block; }
    .m-plist__img-wrap { aspect-ratio: 1.1; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
    .m-plist__img-wrap img { max-width: 90%; max-height: 90%; object-fit: contain; }
    .m-plist__mfr { font-size: 10.5px; font-weight: 700; color: var(--color-primary, #70284e); text-transform: uppercase; }
    .m-plist__desc { font-size: 12.5px; font-weight: 600; color: #1a1a2e; line-height: 1.3; margin: 3px 0; height: 32px; overflow: hidden; }
    .m-plist__pn { font-size: 10.5px; color: #888; margin-bottom: 6px; }
    .m-plist__price-row { display: flex; align-items: baseline; gap: 8px; margin: 6px 0; }
    .m-plist__price { font-size: 15px; font-weight: 800; color: #1a1a2e; }
    .m-plist__add { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 6px; padding: 9px; font-size: 12.5px; font-weight: 700; margin-top: 6px; }
    .m-plist__more { display: block; width: 100%; margin-top: 16px; padding: 13px; border: 1px solid #ddd; border-radius: 8px; background: #fff; font-weight: 700; color: var(--color-primary, #70284e); }
  `]
})
export class MobileProducts implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  allProducts = signal<Product[]>([]);
  categoryParam = signal<string>('');
  searchQuery = signal<string>('');
  filterOpen = signal(false);
  currentPage = signal(1);
  readonly pageSize = PAGE_SIZE;

  sortBy = 'relevance';
  selectedManufacturers = signal<Set<string>>(new Set());
  selectedProductTypes = signal<Set<string>>(new Set());
  selectedMountingStyles = signal<Set<string>>(new Set());
  inStockOnly = signal(false);
  rohsOnly = signal(false);
  priceMin = signal(0);
  priceMax = signal(10000);

  categoryProducts = computed(() => {
    const all = this.allProducts();
    const cat = this.categoryParam();
    return cat ? all.filter(p => p.category === cat) : all;
  });

  manufacturersList = computed(() => [...new Set(this.categoryProducts().map(p => p.manufacturer))].sort());
  productTypesList = computed(() => [...new Set(this.categoryProducts().map(p => p.productType))].sort());
  mountingStylesList = computed(() => [...new Set(this.categoryProducts().map(p => p.mountingStyle))].sort());
  globalMaxPrice = computed(() => {
    const prices = this.categoryProducts().map(p => p.price);
    return prices.length ? Math.ceil(Math.max(...prices)) : 10000;
  });

  pageTitle = computed(() => {
    if (this.searchQuery()) return `Search: "${this.searchQuery()}"`;
    return this.categoryParam() || 'All Products';
  });

  filteredProducts = computed(() => {
    let results = this.categoryProducts();

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
    if (this.inStockOnly()) results = results.filter(p => p.availability > 0);
    if (this.rohsOnly()) results = results.filter(p => p.rohs);
    results = results.filter(p => p.price >= this.priceMin() && p.price <= this.priceMax());

    switch (this.sortBy) {
      case 'price-asc': return [...results].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...results].sort((a, b) => b.price - a.price);
      case 'availability': return [...results].sort((a, b) => b.availability - a.availability);
      case 'name': return [...results].sort((a, b) => a.title.localeCompare(b.title));
      default: return results;
    }
  });

  pagedProducts = computed(() => this.filteredProducts().slice(0, this.currentPage() * this.pageSize));
  showingFrom = computed(() => this.filteredProducts().length === 0 ? 0 : 1);
  showingTo = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredProducts().length));

  activeFilterCount = computed(() =>
    this.selectedManufacturers().size + this.selectedProductTypes().size + this.selectedMountingStyles().size +
    (this.inStockOnly() ? 1 : 0) + (this.rohsOnly() ? 1 : 0)
  );

  filterState = computed<MobileFilterState>(() => ({
    manufacturers: this.manufacturersList(),
    productTypes: this.productTypesList(),
    mountingStyles: this.mountingStylesList(),
    selectedManufacturers: this.selectedManufacturers(),
    selectedProductTypes: this.selectedProductTypes(),
    selectedMountingStyles: this.selectedMountingStyles(),
    inStockOnly: this.inStockOnly(),
    rohsOnly: this.rohsOnly(),
    priceMin: this.priceMin(),
    priceMax: this.priceMax(),
    globalMaxPrice: this.globalMaxPrice()
  }));

  ngOnInit() {
    this.productService.getAll().subscribe(products => {
      this.allProducts.set(products);
      this.priceMax.set(Math.ceil(Math.max(...products.map(p => p.price))));
    });
    this.route.paramMap.subscribe(params => {
      this.categoryParam.set(params.get('category') || '');
      this.currentPage.set(1);
    });
    this.route.queryParamMap.subscribe(qp => {
      this.searchQuery.set(qp.get('q') || '');
      const mfr = qp.get('manufacturer');
      this.selectedManufacturers.set(mfr ? new Set([mfr]) : new Set());
      this.currentPage.set(1);
    });
  }

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
    this.priceMax.set(this.globalMaxPrice());
    this.currentPage.set(1);
  }

  addToCart(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.add(product);
  }

  formatPrice(p: number): string {
    return inr(p);
  }
}
