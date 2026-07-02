import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { inr, priceBreaksINR } from '../../core/utils/price.utils';
import { categoryIconPath, iconPath } from '../../core/utils/icon.utils';
import { manufacturerLogoPath, manufacturerLogoIsDark } from '../../core/utils/manufacturer.utils';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, Header, Footer],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private theme = inject(ThemeService);

  product = signal<Product | null>(null);
  related = signal<Product[]>([]);
  activeTab = signal('specs');
  quantity = signal(1);
  added = signal(false);

  // Image lightbox + magnifier
  lightboxOpen = signal(false);
  magnifierActive = signal(false);
  lensPos = signal({ x: 0, y: 0 });
  lensBgPos = signal('0px 0px');
  lensBgSize = signal('0px 0px');
  private readonly LENS_SIZE = 160;
  private readonly ZOOM = 2.5;

  // Volume pricing — INR, clickable tier selection
  priceBreaks: { qty: string; minQty: number; price: number }[] = [];
  activeTier = signal(0); // index of selected tier

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.activeTab.set('specs');
      this.quantity.set(1);
      this.added.set(false);
      this.activeTier.set(0);
      this.lightboxOpen.set(false);
      this.magnifierActive.set(false);

      this.productService.getById(id).subscribe(p => {
        if (p) {
          this.product.set(p);
          // Prices are already INR — no conversion
          this.priceBreaks = priceBreaksINR(p.price);
        }
      });

      this.productService.getAll().subscribe(prods =>
        this.related.set(prods.filter(p => p.id !== id).slice(0, 5))
      );
    });
  }

  // Price shown in the hero block — updates when tier is selected
  get displayedPrice(): string {
    const tier = this.priceBreaks[this.activeTier()];
    return tier ? inr(tier.price) : '';
  }

  get displayedPriceQtyLabel(): string {
    const tier = this.priceBreaks[this.activeTier()];
    return tier ? `Per Unit · ${tier.qty} pcs · ex. GST` : '';
  }

  selectTier(index: number) {
    this.activeTier.set(index);
    // Auto-update qty to the minimum for that tier
    if (this.priceBreaks[index]) {
      this.quantity.set(this.priceBreaks[index].minQty);
    }
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.add(p, this.quantity());
      this.added.set(true);
      setTimeout(() => this.added.set(false), 2000);
    }
  }

  changeQty(delta: number) {
    this.quantity.set(Math.max(1, this.quantity() + delta));
  }

  setQty(val: string) {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 1) this.quantity.set(n);
  }

  formatINR(price: number): string {
    return inr(price);
  }

  categoryIcon(category: string): string {
    return categoryIconPath(category, this.theme.theme());
  }

  onImgError(event: Event, category: string) {
    (event.target as HTMLImageElement).src = this.categoryIcon(category);
  }

  openLightbox() {
    this.lightboxOpen.set(true);
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
    this.magnifierActive.set(false);
  }

  // Classic lens magnifier: tracks the cursor over the image and renders a
  // zoomed-in crop of the same image inside a small circular lens that follows it.
  onMagnifierMove(event: MouseEvent, container: HTMLElement) {
    const rect = container.getBoundingClientRect();
    const half = this.LENS_SIZE / 2;

    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    x = Math.max(half, Math.min(rect.width - half, x));
    y = Math.max(half, Math.min(rect.height - half, y));

    this.lensPos.set({ x: x - half, y: y - half });
    this.lensBgPos.set(`${-(x * this.ZOOM - half)}px ${-(y * this.ZOOM - half)}px`);
    this.lensBgSize.set(`${rect.width * this.ZOOM}px ${rect.height * this.ZOOM}px`);
  }

  icon(name: string): string {
    return iconPath(name, this.theme.theme());
  }

  manufacturerLogo(name: string): string | null {
    return manufacturerLogoPath(name);
  }

  manufacturerLogoDark(name: string): boolean {
    return manufacturerLogoIsDark(name);
  }

  // Extended price for current qty × active tier price
  get extendedPrice(): string {
    const tier = this.priceBreaks[this.activeTier()];
    if (!tier) return '';
    return inr(tier.price * this.quantity());
  }
}
