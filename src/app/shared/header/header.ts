import { Component, inject, signal, effect, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { inr } from '../../core/utils/price.utils';
import { categoryIconPath, iconPath } from '../../core/utils/icon.utils';
import { ThemeService, ThemeName } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { ALL_MANUFACTURERS, manufacturerLogoPath, manufacturerLogoIsDark } from '../../core/utils/manufacturer.utils';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnDestroy {
  cart = inject(CartService);
  theme = inject(ThemeService);
  auth = inject(AuthService);
  private router = inject(Router);
  private productService = inject(ProductService);
  private el = inject(ElementRef);

  showAccountMenu = signal(false);
  showManufacturersMenu = signal(false);
  readonly manufacturers = ALL_MANUFACTURERS;

  readonly themes: { id: ThemeName; label: string; swatch: string }[] = [
    { id: 'maroon', label: 'Maroon', swatch: '#70284e' },
    { id: 'blue', label: 'Blue', swatch: '#1a3a6b' }
  ];

  searchQuery = signal('');
  suggestions = signal<Product[]>([]);
  showDropdown = signal(false);
  activeIndex = signal(-1);

  private allProducts: Product[] = [];

  showAddedPopup = signal(false);
  addedItem = signal<{ product: Product; qty: number } | null>(null);
  private popupTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.productService.getAll().subscribe(p => this.allProducts = p);

    effect(() => {
      const item = this.cart.lastAdded();
      if (item) {
        this.addedItem.set(item);
        this.showAddedPopup.set(true);
        clearTimeout(this.popupTimer);
        this.popupTimer = setTimeout(() => this.showAddedPopup.set(false), 5000);
      }
    });
  }

  ngOnDestroy() {
    clearTimeout(this.popupTimer);
    // Prevent a stale "added to cart" popup from reappearing when the
    // next page's Header instance mounts and reads a leftover value.
    this.cart.lastAdded.set(null);
  }

  closeAddedPopup() {
    clearTimeout(this.popupTimer);
    this.showAddedPopup.set(false);
  }

  goToCart() {
    this.closeAddedPopup();
    this.router.navigate(['/cart']);
  }

  onInput(val: string) {
    this.searchQuery.set(val);
    this.activeIndex.set(-1);
    const q = val.trim().toLowerCase();
    if (q.length < 2) {
      this.suggestions.set([]);
      this.showDropdown.set(false);
      return;
    }
    const matches = this.allProducts.filter(p =>
      p.manufacturerPartNumber.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.manufacturer.toLowerCase().includes(q) ||
      p.productType.toLowerCase().includes(q)
    ).slice(0, 8);
    this.suggestions.set(matches);
    this.showDropdown.set(matches.length > 0);
  }

  onKeydown(event: KeyboardEvent) {
    const items = this.suggestions();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.set(Math.min(this.activeIndex() + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.set(Math.max(this.activeIndex() - 1, -1));
    } else if (event.key === 'Enter') {
      const idx = this.activeIndex();
      if (idx >= 0 && items[idx]) {
        this.selectProduct(items[idx]);
      } else {
        this.onSearch();
      }
    } else if (event.key === 'Escape') {
      this.closeDropdown();
    }
  }

  selectProduct(product: Product) {
    this.searchQuery.set(product.manufacturerPartNumber);
    this.closeDropdown();
    this.router.navigate(['/product', product.id]);
  }

  onSearch() {
    const q = this.searchQuery().trim();
    this.closeDropdown();
    if (q) {
      this.router.navigate(['/products'], { queryParams: { q } });
    } else {
      this.router.navigate(['/products']);
    }
  }

  closeDropdown() {
    this.showDropdown.set(false);
    this.activeIndex.set(-1);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeDropdown();
      this.showAccountMenu.set(false);
      this.showManufacturersMenu.set(false);
    }
  }

  toggleAccountMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showAccountMenu.update(v => !v);
  }

  toggleManufacturersMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showManufacturersMenu.update(v => !v);
  }

  manufacturerLogo(name: string): string | null {
    return manufacturerLogoPath(name);
  }

  manufacturerLogoDark(name: string): boolean {
    return manufacturerLogoIsDark(name);
  }

  logout() {
    this.auth.logout();
    this.showAccountMenu.set(false);
    this.router.navigate(['/']);
  }

  initials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }

  formatPrice(p: Product): string {
    return inr(p.price);
  }

  formatINR(amount: number): string {
    return inr(amount);
  }

  categoryIcon(category: string): string {
    return categoryIconPath(category, this.theme.theme());
  }

  onImgError(event: Event, category: string) {
    (event.target as HTMLImageElement).src = this.categoryIcon(category);
  }

  icon(name: string): string {
    return iconPath(name, this.theme.theme());
  }

  highlight(text: string): string {
    const q = this.searchQuery().trim();
    if (!q) return text;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
  }
}
