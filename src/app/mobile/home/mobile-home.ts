import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../app/core/services/product.service';
import { CartService } from '../../../app/core/services/cart.service';
import { Product } from '../../../app/core/models/product.model';
import { inr } from '../../../app/core/utils/price.utils';
import { MobileTopBar } from '../shell/mobile-top-bar';
import { MobileBottomNav } from '../shell/mobile-bottom-nav';
import { MobileDrawer } from '../shell/mobile-drawer';

@Component({
  selector: 'app-mobile-home',
  standalone: true,
  imports: [RouterLink, CommonModule, MobileTopBar, MobileBottomNav, MobileDrawer],
  template: `
    <app-mobile-top-bar (menu)="drawerOpen.set(true)"></app-mobile-top-bar>

    <div class="m-home">
      <div class="m-home__banner">
        <span class="m-home__banner-tag">LIMITED TIME ONLY</span>
        <h1 class="m-home__banner-title">25% Off</h1>
        <p class="m-home__banner-sub">Premium Semiconductor Chips Today</p>
        <a routerLink="/m/products" class="m-home__banner-btn">Shop Now</a>
      </div>

      <div class="m-home__tabs">
        <button class="m-home__tab" [class.active]="tab() === 'newest'" (click)="tab.set('newest')">★ Newest Products</button>
        <button class="m-home__tab" [class.active]="tab() === 'semiconductors'" (click)="tab.set('semiconductors')">🖳 Semiconductors</button>
      </div>

      <div class="m-home__grid">
        @for (p of trending(); track p.id) {
          <a [routerLink]="['/m/product', p.id]" class="m-home__card">
            <div class="m-home__card-img-wrap">
              <span class="m-home__card-badge">-25%</span>
              <img [src]="p.image" [alt]="p.title" class="m-home__card-img" />
            </div>
            <div class="m-home__card-body">
              <div class="m-home__card-mfr">{{ p.manufacturer }}</div>
              <div class="m-home__card-title">{{ p.manufacturerPartNumber }}</div>
              <div class="m-home__card-desc">{{ p.title }}</div>
              <div class="m-home__card-stock">{{ p.availability | number }} in stock</div>
              <div class="m-home__card-footer">
                <span class="m-home__card-price">{{ formatPrice(p) }}</span>
                <button class="m-home__card-add" (click)="addToCart(p, $event)">Add</button>
              </div>
            </div>
          </a>
        }
      </div>
    </div>

    <app-mobile-bottom-nav active="home"></app-mobile-bottom-nav>

    @if (drawerOpen()) {
      <app-mobile-drawer (close)="drawerOpen.set(false)"></app-mobile-drawer>
    }
  `,
  styles: [`
    .m-home { background: #f5f5f7; min-height: calc(100vh - 140px); padding-bottom: 12px; }
    .m-home__banner {
      background: linear-gradient(135deg, #1a3a6b, #2a5aab);
      color: #fff; padding: 24px 20px 28px;
    }
    .m-home__banner-tag {
      background: rgba(255,255,255,0.18); font-size: 11px; font-weight: 700;
      padding: 4px 10px; border-radius: 999px; display: inline-block; margin-bottom: 12px;
    }
    .m-home__banner-title { font-size: 34px; font-weight: 800; margin: 0 0 6px; }
    .m-home__banner-sub { font-size: 15px; opacity: 0.9; margin: 0 0 16px; }
    .m-home__banner-btn {
      display: inline-block; background: var(--color-primary, #70284e); color: #fff;
      padding: 11px 22px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;
    }
    .m-home__tabs { display: flex; gap: 10px; padding: 16px; overflow-x: auto; }
    .m-home__tab {
      white-space: nowrap; padding: 10px 16px; border-radius: 999px; border: 1px solid #e0e0e6;
      background: #fff; font-weight: 700; font-size: 13.5px; color: #444;
    }
    .m-home__tab.active { background: var(--color-primary, #70284e); color: #fff; border-color: transparent; }
    .m-home__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
    .m-home__card { background: #fff; border-radius: 10px; overflow: hidden; text-decoration: none; color: inherit; display: block; }
    .m-home__card-img-wrap { position: relative; background: #f0f0f0; aspect-ratio: 1.3; display: flex; align-items: center; justify-content: center; }
    .m-home__card-badge {
      position: absolute; top: 8px; left: 8px; background: var(--color-primary, #70284e); color: #fff;
      font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;
    }
    .m-home__card-img { max-width: 80%; max-height: 80%; object-fit: contain; }
    .m-home__card-body { padding: 10px; }
    .m-home__card-mfr { font-size: 10.5px; color: #888; text-transform: uppercase; }
    .m-home__card-title { font-size: 13px; font-weight: 700; color: var(--color-primary, #70284e); margin: 2px 0; }
    .m-home__card-desc { font-size: 11.5px; color: #555; line-height: 1.3; height: 30px; overflow: hidden; }
    .m-home__card-stock { font-size: 10.5px; color: #2a9d5c; margin: 4px 0; }
    .m-home__card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
    .m-home__card-price { font-weight: 800; font-size: 14px; color: #1a1a2e; }
    .m-home__card-add { background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 6px; padding: 5px 12px; font-size: 12px; font-weight: 700; }
  `]
})
export class MobileHome implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  trending = signal<Product[]>([]);
  tab = signal<'newest' | 'semiconductors'>('newest');
  drawerOpen = signal(false);

  ngOnInit() {
    this.productService.getTrending().subscribe(p => this.trending.set(p));
  }

  addToCart(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.add(product);
  }

  formatPrice(p: Product): string {
    return inr(p.price);
  }
}
