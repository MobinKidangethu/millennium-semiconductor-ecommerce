import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { inr, priceBreaksINR } from '../../core/utils/price.utils';

@Component({
  selector: 'app-mobile-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (product(); as p) {
      <header class="m-pd-header">
        <button class="m-pd-header__back" (click)="goBack()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1a1a2e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <h1>Product Details</h1>
        <div class="m-pd-header__icons">
          <button (click)="wishlisted.set(!wishlisted())">{{ wishlisted() ? '♥' : '♡' }}</button>
          <button>⇪</button>
        </div>
      </header>

      <div class="m-pd">
        <div class="m-pd__image-wrap">
          <span class="m-pd__badge">-25%</span>
          <img [src]="p.image" [alt]="p.title" />
        </div>

        <div class="m-pd__body">
          <div class="m-pd__mfr">{{ p.manufacturer | uppercase }}</div>
          <h2 class="m-pd__title">{{ p.title }}</h2>

          <div class="m-pd__rating">★★★★<span class="m-pd__rating-empty">☆</span> <span class="m-pd__reviews">(89) Reviews</span></div>

          <div class="m-pd__price-row">
            <span class="m-pd__price">{{ formatPrice(p.price) }}</span>
            <span class="m-pd__price-strike">{{ formatPrice(p.price * 1.33) }}</span>
            <span class="m-pd__hotdeal">HOT DEAL</span>
          </div>

          <p class="m-pd__avail">Ask for availability, duration ~4-6 weeks. Request quote for bulk orders.</p>

          <div class="m-pd__vp-label">Volume Pricing</div>
          <div class="m-pd__vp-row">
            @for (b of priceBreaks; track b.qty; let i = $index) {
              <button class="m-pd__vp-tile" [class.active]="activeTier() === i" (click)="activeTier.set(i)">
                <span class="m-pd__vp-price">{{ formatPrice(b.price) }}</span>
                <span class="m-pd__vp-qty">{{ b.qty }}</span>
              </button>
            }
            <button class="m-pd__vp-more">More</button>
          </div>

          <div class="m-pd__qty-row">
            <button (click)="decQty()">−</button>
            <span>{{ quantity() }}</span>
            <button (click)="incQty()">+</button>
          </div>
        </div>
      </div>

      <div class="m-pd__actions">
        <button class="m-pd__quote">Request a Quote</button>
        <button class="m-pd__add" (click)="addToCart(p)">🛒 Add to Cart</button>
      </div>
    }
  `,
  styles: [`
    .m-pd-header { display: flex; align-items: center; gap: 12px; padding: 16px; border-bottom: 1px solid #eee; background: #fff; }
    .m-pd-header__back { background: none; border: none; }
    .m-pd-header h1 { flex: 1; font-size: 18px; font-weight: 700; margin: 0; color: #1a1a2e; }
    .m-pd-header__icons { display: flex; gap: 16px; }
    .m-pd-header__icons button { background: none; border: none; font-size: 19px; }
    .m-pd { background: #fff; padding-bottom: 90px; }
    .m-pd__image-wrap { position: relative; background: #fff; display: flex; align-items: center; justify-content: center; padding: 30px; min-height: 260px; }
    .m-pd__badge { position: absolute; top: 16px; left: 16px; background: #2a9d5c; color: #fff; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px; }
    .m-pd__image-wrap img { max-width: 80%; max-height: 240px; object-fit: contain; }
    .m-pd__body { padding: 16px; }
    .m-pd__mfr { font-size: 12.5px; color: #888; font-weight: 700; letter-spacing: 0.5px; }
    .m-pd__title { font-size: 20px; font-weight: 800; color: #1a1a2e; margin: 6px 0 10px; line-height: 1.3; }
    .m-pd__rating { color: #f5a623; font-size: 16px; margin-bottom: 10px; }
    .m-pd__rating-empty { color: #ddd; }
    .m-pd__reviews { color: #888; font-size: 13.5px; }
    .m-pd__price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; }
    .m-pd__price { font-size: 26px; font-weight: 800; color: var(--color-primary, #70284e); }
    .m-pd__price-strike { font-size: 15px; color: #999; text-decoration: line-through; }
    .m-pd__hotdeal { background: #fde8e8; color: #c0392b; font-size: 11.5px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
    .m-pd__avail { font-size: 13.5px; color: #666; margin-bottom: 16px; }
    .m-pd__vp-label { font-size: 13.5px; font-weight: 700; color: #333; margin-bottom: 8px; }
    .m-pd__vp-row { display: flex; gap: 8px; margin-bottom: 18px; overflow-x: auto; }
    .m-pd__vp-tile { flex-shrink: 0; border: 1px solid #ddd; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; align-items: center; background: #fff; min-width: 76px; }
    .m-pd__vp-tile.active { background: var(--color-primary, #70284e); color: #fff; border-color: transparent; }
    .m-pd__vp-price { font-weight: 800; font-size: 13.5px; }
    .m-pd__vp-qty { font-size: 11px; opacity: 0.8; }
    .m-pd__vp-more { flex-shrink: 0; border: 1px solid #ddd; border-radius: 8px; padding: 10px 16px; background: #fff; color: #333; }
    .m-pd__qty-row { display: flex; align-items: center; gap: 0; width: fit-content; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .m-pd__qty-row button { width: 44px; height: 44px; background: #f7f7f7; border: none; font-size: 18px; }
    .m-pd__qty-row span { width: 56px; text-align: center; font-weight: 700; font-size: 15px; }
    .m-pd__actions { position: fixed; bottom: 0; left: 0; right: 0; display: flex; gap: 10px; padding: 14px 16px; background: #fff; border-top: 1px solid #eee; }
    .m-pd__quote { flex: 1; border: 1.5px solid var(--color-primary, #70284e); color: var(--color-primary, #70284e); background: #fff; border-radius: 8px; padding: 13px; font-weight: 700; }
    .m-pd__add { flex: 1.3; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 13px; font-weight: 700; }
  `]
})
export class MobileProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  quantity = signal(1);
  activeTier = signal(0);
  wishlisted = signal(false);
  priceBreaks: { qty: string; minQty: number; price: number }[] = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.productService.getById(id).subscribe(p => {
        this.product.set(p ?? null);
        if (p) this.priceBreaks = priceBreaksINR(p.price);
      });
    });
  }

  goBack() { this.router.navigate(['/m/products']); }
  incQty() { this.quantity.update(q => q + 1); }
  decQty() { this.quantity.update(q => Math.max(1, q - 1)); }

  addToCart(p: Product) {
    this.cartService.add(p, this.quantity());
    this.router.navigate(['/cart']);
  }

  formatPrice(p: number): string {
    return inr(p);
  }
}
