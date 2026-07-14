import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { inr } from '../../core/utils/price.utils';
import { MobileBackHeader } from '../shell/mobile-back-header';
import { MobileBottomNav } from '../shell/mobile-bottom-nav';
import { MobileFilterDrawer } from './mobile-filter-drawer';

@Component({
  selector: 'app-mobile-products',
  standalone: true,
  imports: [RouterLink, CommonModule, MobileBackHeader, MobileBottomNav, MobileFilterDrawer],
  template: `
    <app-mobile-back-header [title]="category()"></app-mobile-back-header>
    <div class="m-plist">
      <div class="m-plist__breadcrumb">Home &gt; Products &gt; <strong>{{ category() }}</strong></div>
      <h1 class="m-plist__title">{{ category() }} <span class="m-plist__count">({{ products().length | number }} Products)</span></h1>

      <div class="m-plist__toolbar">
        <button class="m-plist__filter-btn" (click)="filterOpen.set(true)">☰ Filter</button>
        <button class="m-plist__sort-btn">Sort: Relevance ⌄</button>
      </div>

      <div class="m-plist__showing">Showing 0-{{ products().length }} of {{ products().length | number }} results</div>

      <div class="m-plist__grid">
        @for (p of products(); track p.id) {
          <a [routerLink]="['/m/product', p.id]" class="m-plist__card">
            <div class="m-plist__img-wrap"><img [src]="p.image" [alt]="p.title" /></div>
            <div class="m-plist__mfr">{{ p.manufacturer }}</div>
            <div class="m-plist__desc">{{ p.title }}</div>
            <div class="m-plist__pn">PN: {{ p.manufacturerPartNumber }}</div>
            <div class="m-plist__price-row">
              <span class="m-plist__price-strike">{{ formatPrice(p.price * 1.3) }}</span>
              <span class="m-plist__price">{{ formatPrice(p.price) }}</span>
            </div>
            <button class="m-plist__add" (click)="addToCart(p, $event)">Add to Cart</button>
          </a>
        }
      </div>
    </div>
    <app-mobile-bottom-nav active="categories"></app-mobile-bottom-nav>

    @if (filterOpen()) {
      <app-mobile-filter-drawer (close)="filterOpen.set(false)" (apply)="filterOpen.set(false)"></app-mobile-filter-drawer>
    }
  `,
  styles: [`
    .m-plist { background: #fff; padding: 16px; min-height: calc(100vh - 200px); }
    .m-plist__breadcrumb { font-size: 12.5px; color: #888; margin-bottom: 10px; }
    .m-plist__breadcrumb strong { color: var(--color-primary, #70284e); }
    .m-plist__title { font-size: 21px; font-weight: 800; color: #1a1a2e; margin: 0 0 14px; }
    .m-plist__count { font-size: 14px; font-weight: 500; color: #888; }
    .m-plist__toolbar { display: flex; gap: 10px; margin-bottom: 14px; }
    .m-plist__filter-btn, .m-plist__sort-btn { flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 11px; font-size: 13.5px; font-weight: 700; background: #fff; color: #1a1a2e; }
    .m-plist__showing { font-size: 13px; color: #888; margin-bottom: 12px; }
    .m-plist__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .m-plist__card { background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 10px; text-decoration: none; color: inherit; display: block; }
    .m-plist__img-wrap { aspect-ratio: 1.1; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
    .m-plist__img-wrap img { max-width: 90%; max-height: 90%; object-fit: contain; }
    .m-plist__mfr { font-size: 10.5px; font-weight: 700; color: var(--color-primary, #70284e); text-transform: uppercase; }
    .m-plist__desc { font-size: 12.5px; font-weight: 600; color: #1a1a2e; line-height: 1.3; margin: 3px 0; height: 32px; overflow: hidden; }
    .m-plist__pn { font-size: 10.5px; color: #888; margin-bottom: 6px; }
    .m-plist__price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
    .m-plist__price-strike { font-size: 11.5px; color: #999; text-decoration: line-through; }
    .m-plist__price { font-size: 15px; font-weight: 800; color: #1a1a2e; }
    .m-plist__add { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 6px; padding: 9px; font-size: 12.5px; font-weight: 700; }
  `]
})
export class MobileProducts implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  category = signal<string>('Semiconductors');
  products = signal<Product[]>([]);
  filterOpen = signal(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category') || 'Semiconductors';
      this.category.set(cat);
      this.productService.getAll().subscribe(all => {
        const filtered = all.filter(p => p.category === cat);
        this.products.set(filtered.length ? filtered : all);
      });
    });
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
