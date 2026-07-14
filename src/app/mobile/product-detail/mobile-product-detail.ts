import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { inr, priceBreaksINR } from '../../core/utils/price.utils';
import { manufacturerLogoPath, manufacturerLogoIsDark } from '../../core/utils/manufacturer.utils';
import { BackorderBadge } from '../../shared/backorder-badge/backorder-badge';

@Component({
  selector: 'app-mobile-product-detail',
  standalone: true,
  imports: [CommonModule, BackorderBadge],
  template: `
    @if (product(); as p) {
      <header class="m-pd-header">
        <button class="m-pd-header__back" (click)="goBack()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1a1a2e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <h1>Product Details</h1>
      </header>

      <div class="m-pd">
        <div class="m-pd__image-wrap">
          <img [src]="p.image" [alt]="p.title" />
        </div>

        <div class="m-pd__body">
          @if (manufacturerLogo(p.manufacturer); as logo) {
            <div class="m-pd__mfr-logo" [class.dark]="manufacturerLogoDark(p.manufacturer)"><img [src]="logo" [alt]="p.manufacturer" /></div>
          } @else {
            <div class="m-pd__mfr">{{ p.manufacturer | uppercase }}</div>
          }
          <h2 class="m-pd__title">{{ p.title }}</h2>
          <div class="m-pd__pn">MPN: {{ p.manufacturerPartNumber }} &nbsp;·&nbsp; Mouser: {{ p.mouserPartNumber }}</div>

          <app-backorder-badge [product]="p" [qty]="quantity()"></app-backorder-badge>

          <div class="m-pd__price-row">
            <span class="m-pd__price">{{ displayedPrice() }}</span>
            <span class="m-pd__price-label">{{ displayedPriceQtyLabel() }}</span>
          </div>

          <div class="m-pd__vp-label">Volume Pricing</div>
          <div class="m-pd__vp-row">
            @for (b of priceBreaks; track b.qty; let i = $index) {
              <button class="m-pd__vp-tile" [class.active]="activeTier() === i" (click)="selectTier(i)">
                <span class="m-pd__vp-price">{{ formatPrice(b.price) }}</span>
                <span class="m-pd__vp-qty">{{ b.qty }}</span>
              </button>
            }
          </div>

          <div class="m-pd__qty-row">
            <span class="m-pd__qty-label">Quantity</span>
            <div class="m-pd__qty-stepper">
              <button (click)="changeQty(-1)">−</button>
              <input type="number" [value]="quantity()" (change)="setQty($event)" />
              <button (click)="changeQty(1)">+</button>
            </div>
          </div>

          <div class="m-pd__extended">Extended Price: <strong>{{ extendedPrice() }}</strong></div>

          <div class="m-pd__tabs">
            @for (tab of tabs; track tab) {
              <button class="m-pd__tab" [class.active]="activeTab() === tab" (click)="activeTab.set(tab)">
                {{ tab === 'specs' ? 'Specifications' : tab === 'documents' ? 'Documents' : 'Related' }}
              </button>
            }
          </div>

          @if (activeTab() === 'specs') {
            <div class="m-pd__specs">
              <div class="m-pd__spec-row"><span>Product Type</span><span>{{ p.productType }}</span></div>
              <div class="m-pd__spec-row"><span>Technology</span><span>{{ p.technology || 'N/A' }}</span></div>
              <div class="m-pd__spec-row"><span>Mounting Style</span><span>{{ p.mountingStyle }}</span></div>
              <div class="m-pd__spec-row"><span>Package / Case</span><span>{{ p.package || 'N/A' }}</span></div>
              <div class="m-pd__spec-row"><span>Lifecycle</span><span>{{ p.lifecycle }}</span></div>
              <div class="m-pd__spec-row"><span>RoHS Status</span><span>{{ p.rohsLabel }}</span></div>
            </div>
          }

          @if (activeTab() === 'documents') {
            <div class="m-pd__specs">
              @if (p.datasheet) {
                <a [href]="p.datasheet" target="_blank" class="m-pd__doc-link">📄 View Datasheet</a>
              } @else {
                <p class="m-pd__no-docs">No documents available for this part.</p>
              }
            </div>
          }

          @if (activeTab() === 'related') {
            <div class="m-pd__related-grid">
              @for (r of related(); track r.id) {
                <a (click)="goToProduct(r.id)" class="m-pd__related-card">
                  <img [src]="r.image" [alt]="r.title" />
                  <div class="m-pd__related-title">{{ r.title }}</div>
                  <div class="m-pd__related-price">{{ formatPrice(r.price) }}</div>
                </a>
              }
            </div>
          }
        </div>
      </div>

      <div class="m-pd__actions">
        <button class="m-pd__add" (click)="addToCart(p)">🛒 Add to Cart{{ added() ? ' ✓' : '' }}</button>
      </div>
    }
  `,
  styles: [`
    .m-pd-header { display: flex; align-items: center; gap: 12px; padding: 16px; border-bottom: 1px solid #eee; background: #fff; }
    .m-pd-header__back { background: none; border: none; }
    .m-pd-header h1 { flex: 1; font-size: 18px; font-weight: 700; margin: 0; color: #1a1a2e; }
    .m-pd { background: #fff; padding-bottom: 90px; }
    .m-pd__image-wrap { background: #fafafa; display: flex; align-items: center; justify-content: center; padding: 30px; min-height: 220px; }
    .m-pd__image-wrap img { max-width: 80%; max-height: 200px; object-fit: contain; }
    .m-pd__body { padding: 16px; }
    .m-pd__mfr { font-size: 12.5px; color: #888; font-weight: 700; letter-spacing: 0.5px; }
    .m-pd__mfr-logo { height: 26px; margin-bottom: 6px; }
    .m-pd__mfr-logo img { height: 100%; object-fit: contain; }
    .m-pd__mfr-logo.dark { background: #1a1a2e; display: inline-flex; padding: 4px 10px; border-radius: 4px; }
    .m-pd__title { font-size: 19px; font-weight: 800; color: #1a1a2e; margin: 6px 0 6px; line-height: 1.3; }
    .m-pd__pn { font-size: 12.5px; color: #888; margin-bottom: 12px; }
    .m-pd__price-row { display: flex; align-items: baseline; gap: 10px; margin: 14px 0 4px; }
    .m-pd__price { font-size: 26px; font-weight: 800; color: var(--color-primary, #70284e); }
    .m-pd__price-label { font-size: 12.5px; color: #888; }
    .m-pd__vp-label { font-size: 13.5px; font-weight: 700; color: #333; margin: 16px 0 8px; }
    .m-pd__vp-row { display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; }
    .m-pd__vp-tile { flex-shrink: 0; border: 1px solid #ddd; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; align-items: center; background: #fff; min-width: 76px; }
    .m-pd__vp-tile.active { background: var(--color-primary, #70284e); color: #fff; border-color: transparent; }
    .m-pd__vp-price { font-weight: 800; font-size: 13.5px; }
    .m-pd__vp-qty { font-size: 11px; opacity: 0.8; }
    .m-pd__qty-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .m-pd__qty-label { font-size: 14px; font-weight: 700; color: #333; }
    .m-pd__qty-stepper { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .m-pd__qty-stepper button { width: 40px; height: 40px; background: #f7f7f7; border: none; font-size: 18px; }
    .m-pd__qty-stepper input { width: 56px; text-align: center; border: none; font-weight: 700; font-size: 15px; }
    .m-pd__extended { font-size: 13.5px; color: #555; margin-bottom: 20px; }
    .m-pd__extended strong { color: #1a1a2e; }
    .m-pd__tabs { display: flex; gap: 6px; border-bottom: 1px solid #eee; margin-bottom: 14px; }
    .m-pd__tab { padding: 10px 4px; margin-right: 16px; background: none; border: none; border-bottom: 2px solid transparent; font-size: 13.5px; font-weight: 700; color: #888; }
    .m-pd__tab.active { color: var(--color-primary, #70284e); border-bottom-color: var(--color-primary, #70284e); }
    .m-pd__specs { padding-bottom: 8px; }
    .m-pd__spec-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f4f4f4; font-size: 13.5px; }
    .m-pd__spec-row span:first-child { color: #888; }
    .m-pd__spec-row span:last-child { color: #1a1a2e; font-weight: 600; text-align: right; }
    .m-pd__doc-link { display: block; color: var(--color-primary, #70284e); font-weight: 700; padding: 12px 0; }
    .m-pd__no-docs { color: #888; font-size: 13.5px; }
    .m-pd__related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .m-pd__related-card { background: #fafafa; border-radius: 8px; padding: 10px; text-decoration: none; color: inherit; cursor: pointer; }
    .m-pd__related-card img { width: 100%; height: 70px; object-fit: contain; margin-bottom: 6px; }
    .m-pd__related-title { font-size: 11.5px; color: #333; line-height: 1.3; height: 30px; overflow: hidden; }
    .m-pd__related-price { font-weight: 700; font-size: 12.5px; color: #1a1a2e; margin-top: 4px; }
    .m-pd__actions { position: fixed; bottom: 0; left: 0; right: 0; padding: 14px 16px; background: #fff; border-top: 1px solid #eee; }
    .m-pd__add { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 14px; font-weight: 700; font-size: 15.5px; }
  `]
})
export class MobileProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  related = signal<Product[]>([]);
  quantity = signal(1);
  activeTier = signal(0);
  activeTab = signal<'specs' | 'documents' | 'related'>('specs');
  added = signal(false);
  tabs: Array<'specs' | 'documents' | 'related'> = ['specs', 'documents', 'related'];
  priceBreaks: { qty: string; minQty: number; price: number }[] = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.activeTab.set('specs');
      this.quantity.set(1);
      this.activeTier.set(0);
      this.added.set(false);

      this.productService.getById(id).subscribe(p => {
        this.product.set(p ?? null);
        if (p) this.priceBreaks = priceBreaksINR(p.price);
      });
      this.productService.getAll().subscribe(prods =>
        this.related.set(prods.filter(p => p.id !== id).slice(0, 4))
      );
    });
  }

  goBack() { this.router.navigate(['/m/products']); }
  goToProduct(id: number) { this.router.navigate(['/m/product', id]); }

  changeQty(delta: number) { this.quantity.set(Math.max(1, this.quantity() + delta)); }
  setQty(event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val) && val >= 1) this.quantity.set(val);
  }

  selectTier(index: number) {
    this.activeTier.set(index);
    if (this.priceBreaks[index]) this.quantity.set(this.priceBreaks[index].minQty);
  }

  displayedPrice(): string {
    const tier = this.priceBreaks[this.activeTier()];
    return tier ? inr(tier.price) : '';
  }

  displayedPriceQtyLabel(): string {
    const tier = this.priceBreaks[this.activeTier()];
    return tier ? `Per Unit · ${tier.qty} pcs · ex. GST` : '';
  }

  extendedPrice(): string {
    const tier = this.priceBreaks[this.activeTier()];
    if (!tier) return '';
    return inr(tier.price * this.quantity());
  }

  addToCart(p: Product) {
    this.cartService.add(p, this.quantity());
    this.added.set(true);
    setTimeout(() => this.router.navigate(['/cart']), 500);
  }

  manufacturerLogo(name: string): string | null {
    return manufacturerLogoPath(name);
  }

  manufacturerLogoDark(name: string): boolean {
    return manufacturerLogoIsDark(name);
  }

  formatPrice(p: number): string {
    return inr(p);
  }
}
