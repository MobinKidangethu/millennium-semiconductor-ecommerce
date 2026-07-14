import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { inr } from '../../core/utils/price.utils';
import { categoryIconPath } from '../../core/utils/icon.utils';
import { manufacturerLogoPath, manufacturerLogoIsDark } from '../../core/utils/manufacturer.utils';
import { ALL_MANUFACTURERS } from '../../core/utils/manufacturer.utils';
import { ThemeService } from '../../core/services/theme.service';
import { CATEGORIES } from '../../pages/home/home';
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
      <div class="m-home__section-head">
        <h2>Shop by Category</h2>
        <a routerLink="/m/categories">View All →</a>
      </div>
      <div class="m-home__cat-scroller">
        @for (cat of categories; track cat.name) {
          <a [routerLink]="['/m/products', cat.name]" class="m-home__cat-card">
            <img [src]="categoryIcon(cat.name)" alt="" />
            <strong>{{ cat.name }}</strong>
            <span>{{ cat.count }}</span>
          </a>
        }
      </div>

      <div class="m-home__section-head">
        <h2>Trending Products</h2>
        <a routerLink="/m/products">View All →</a>
      </div>
      <div class="m-home__grid">
        @for (p of trending(); track p.id) {
          <a [routerLink]="['/m/product', p.id]" class="m-home__card">
            <div class="m-home__card-img-wrap">
              <img [src]="p.image" [alt]="p.title" class="m-home__card-img" (error)="onImgError($event, p.category)" />
            </div>
            <div class="m-home__card-body">
              <div class="m-home__card-mfr">{{ p.manufacturer }}</div>
              <div class="m-home__card-title">{{ p.title }}</div>
              <div class="m-home__card-meta">{{ p.productType }} · {{ p.package }}</div>
              <div class="m-home__card-stock">{{ p.availability | number }} in stock</div>
              <div class="m-home__card-footer">
                <div>
                  <span class="m-home__card-price">{{ formatPrice(p) }}</span>
                  <span class="m-home__card-unit">1-9 pcs</span>
                </div>
                <button class="m-home__card-add" [class.done]="addedId() === p.id" (click)="addToCart(p, $event)">
                  {{ addedId() === p.id ? '✓' : '+ Add' }}
                </button>
              </div>
            </div>
          </a>
        }
      </div>

      <div class="m-home__section-head">
        <h2>Top Manufacturers</h2>
      </div>
      <div class="m-home__mfr-scroller">
        @for (mfr of manufacturers(); track mfr) {
          <a [routerLink]="['/m/products']" [queryParams]="{ manufacturer: mfr }" class="m-home__mfr-card">
            @if (manufacturerLogo(mfr); as logo) {
              <div class="m-home__mfr-logo" [class.dark]="manufacturerLogoDark(mfr)">
                <img [src]="logo" [alt]="mfr" />
              </div>
            } @else {
              <div class="m-home__mfr-logo m-home__mfr-logo--letter">{{ mfr[0] }}</div>
            }
            <span>{{ mfr }}</span>
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
    .m-home { background: #f5f5f7; min-height: calc(100vh - 140px); padding-bottom: 20px; }
    .m-home__section-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 16px 12px; }
    .m-home__section-head h2 { font-size: 17px; font-weight: 800; color: #1a1a2e; margin: 0; }
    .m-home__section-head a { font-size: 12.5px; font-weight: 700; color: var(--color-primary, #70284e); text-decoration: none; }
    .m-home__cat-scroller { display: flex; gap: 12px; overflow-x: auto; padding: 0 16px; }
    .m-home__cat-card { flex-shrink: 0; width: 100px; background: #fff; border-radius: 10px; padding: 12px 10px; text-align: center; text-decoration: none; color: #1a1a2e; }
    .m-home__cat-card img { width: 36px; height: 36px; object-fit: contain; margin-bottom: 8px; }
    .m-home__cat-card strong { display: block; font-size: 11.5px; font-weight: 700; line-height: 1.25; margin-bottom: 4px; }
    .m-home__cat-card span { font-size: 10px; color: #888; }
    .m-home__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
    .m-home__card { background: #fff; border-radius: 10px; overflow: hidden; text-decoration: none; color: inherit; display: block; }
    .m-home__card-img-wrap { position: relative; background: #fafafa; aspect-ratio: 1.3; display: flex; align-items: center; justify-content: center; }
    .m-home__card-img { max-width: 75%; max-height: 75%; object-fit: contain; }
    .m-home__card-body { padding: 10px; }
    .m-home__card-mfr { font-size: 10.5px; color: #888; text-transform: uppercase; }
    .m-home__card-title { font-size: 12.5px; font-weight: 700; color: #1a1a2e; margin: 2px 0; line-height: 1.3; height: 32px; overflow: hidden; }
    .m-home__card-meta { font-size: 10.5px; color: #888; margin-bottom: 4px; }
    .m-home__card-stock { font-size: 10.5px; color: #2a9d5c; margin-bottom: 4px; }
    .m-home__card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
    .m-home__card-price { font-weight: 800; font-size: 14px; color: #1a1a2e; display: block; }
    .m-home__card-unit { font-size: 9.5px; color: #999; }
    .m-home__card-add { background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 6px; padding: 5px 10px; font-size: 11.5px; font-weight: 700; }
    .m-home__card-add.done { background: #2a9d5c; }
    .m-home__mfr-scroller { display: flex; gap: 12px; overflow-x: auto; padding: 0 16px; }
    .m-home__mfr-card { flex-shrink: 0; width: 90px; background: #fff; border-radius: 10px; padding: 14px 8px; text-align: center; text-decoration: none; color: #333; font-size: 10.5px; font-weight: 600; }
    .m-home__mfr-logo { height: 30px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
    .m-home__mfr-logo img { max-height: 100%; max-width: 100%; object-fit: contain; }
    .m-home__mfr-logo--letter { background: var(--color-primary, #70284e); color: #fff; width: 30px; height: 30px; border-radius: 50%; margin: 0 auto 8px; font-weight: 800; }
    .m-home__mfr-logo.dark { background: #1a1a2e; border-radius: 4px; }
  `]
})
export class MobileHome implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private theme = inject(ThemeService);

  trending = signal<Product[]>([]);
  manufacturers = signal<string[]>([]);
  addedId = signal<number | null>(null);
  drawerOpen = signal(false);
  categories = CATEGORIES;

  ngOnInit() {
    this.productService.getTrending().subscribe(p => this.trending.set(p));
    this.manufacturers.set(ALL_MANUFACTURERS.slice(0, 10));
  }

  addToCart(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.add(product);
    this.addedId.set(product.id);
    setTimeout(() => this.addedId.set(null), 1500);
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

  formatPrice(p: Product): string {
    return inr(p.price);
  }
}
