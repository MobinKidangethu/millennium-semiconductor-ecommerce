import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { inr } from '../../core/utils/price.utils';
import { MobileTopBar } from '../shell/mobile-top-bar';
import { MobileBottomNav } from '../shell/mobile-bottom-nav';
import { MobileDrawer } from '../shell/mobile-drawer';

@Component({
  selector: 'app-mobile-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, MobileTopBar, MobileBottomNav, MobileDrawer],
  template: `
    <app-mobile-top-bar (menu)="drawerOpen.set(true)"></app-mobile-top-bar>

    <div class="m-cart">
      <div class="m-cart__header">
        <h1>Shopping Cart</h1>
        <button (click)="cart.clear()">🗑 Clear Cart</button>
      </div>

      @if (cart.items().length === 0) {
        <div class="m-cart__empty">
          <p>Your cart is empty.</p>
          <a routerLink="/m/products">Continue Shopping</a>
        </div>
      } @else {
        @for (item of cart.items(); track item.product.id) {
          <div class="m-cart__item">
            <div class="m-cart__item-top">
              <img [src]="item.product.image" [alt]="item.product.title" class="m-cart__item-img" />
              <div class="m-cart__item-info">
                <div class="m-cart__item-mfr">{{ item.product.manufacturer }}</div>
                <div class="m-cart__item-pn">{{ item.product.manufacturerPartNumber }}</div>
                <div class="m-cart__item-desc">{{ item.product.title }}</div>
                <div class="m-cart__item-tags">
                  <span class="m-cart__tag">{{ item.product.mountingStyle }}</span>
                  <span class="m-cart__tag">{{ item.product.package }}</span>
                  <span class="m-cart__tag">{{ item.product.stockStatus }}</span>
                </div>
              </div>
              <button class="m-cart__item-del" (click)="cart.remove(item.product.id)">🗑</button>
            </div>
            <div class="m-cart__item-bottom">
              <div>
                <div class="m-cart__unit">Unit: {{ formatPrice(item.product.price) }}</div>
                <div class="m-cart__total">Total: {{ formatPrice(item.product.price * item.qty) }}</div>
              </div>
              <div class="m-cart__qty-row">
                <button (click)="cart.updateQty(item.product.id, item.qty - 1)">−</button>
                <span>{{ item.qty }}</span>
                <button (click)="cart.updateQty(item.product.id, item.qty + 1)">+</button>
              </div>
            </div>
          </div>
        }

        <div class="m-cart__promo">
          <input placeholder="Enter promo code" />
          <button>Apply</button>
        </div>

        <div class="m-cart__summary">
          <div class="m-cart__summary-row"><span>Subtotal</span><span>{{ formatPrice(cart.subtotal()) }}</span></div>
          <div class="m-cart__summary-row"><span>Est. Tax (18% GST)</span><span>{{ formatPrice(cart.tax()) }}</span></div>
          <div class="m-cart__summary-row m-cart__summary-row--total"><span>Total</span><span>{{ formatPrice(cart.total()) }}</span></div>
        </div>

        <button class="m-cart__checkout" (click)="router.navigate(['/m/checkout/address'])">Proceed to Checkout</button>
      }
    </div>

    <app-mobile-bottom-nav active="cart"></app-mobile-bottom-nav>

    @if (drawerOpen()) {
      <app-mobile-drawer (close)="drawerOpen.set(false)"></app-mobile-drawer>
    }
  `,
  styles: [`
    .m-cart { background: #f5f5f7; min-height: calc(100vh - 140px); padding: 0 0 16px; }
    .m-cart__header { display: flex; align-items: center; justify-content: space-between; padding: 18px 16px 12px; background: #fff; }
    .m-cart__header h1 { font-size: 22px; font-weight: 800; color: #1a1a2e; margin: 0; }
    .m-cart__header button { background: none; border: none; color: #888; font-size: 13.5px; font-weight: 600; }
    .m-cart__empty { text-align: center; padding: 60px 20px; color: #888; }
    .m-cart__empty a { display: inline-block; margin-top: 12px; color: var(--color-primary, #70284e); font-weight: 700; text-decoration: none; }
    .m-cart__item { background: #fff; margin: 10px 16px; border-radius: 10px; padding: 14px; }
    .m-cart__item-top { display: flex; gap: 12px; }
    .m-cart__item-img { width: 70px; height: 70px; object-fit: contain; border: 1px solid #eee; border-radius: 8px; padding: 6px; }
    .m-cart__item-info { flex: 1; }
    .m-cart__item-mfr { font-size: 12px; color: #888; }
    .m-cart__item-pn { font-size: 15px; font-weight: 800; color: var(--color-primary, #70284e); margin: 2px 0; }
    .m-cart__item-desc { font-size: 12.5px; color: #444; line-height: 1.3; }
    .m-cart__item-tags { display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap; }
    .m-cart__tag { background: #f0f0f3; font-size: 10.5px; padding: 2px 7px; border-radius: 4px; color: #666; }
    .m-cart__item-del { background: none; border: none; color: #c0392b; align-self: flex-start; }
    .m-cart__item-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f4f4f4; }
    .m-cart__unit { font-size: 12.5px; color: #888; }
    .m-cart__total { font-size: 15px; font-weight: 800; color: #1a1a2e; }
    .m-cart__qty-row { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .m-cart__qty-row button { width: 34px; height: 34px; background: #f7f7f7; border: none; font-size: 16px; }
    .m-cart__qty-row span { width: 40px; text-align: center; font-weight: 700; }
    .m-cart__promo { display: flex; gap: 10px; margin: 16px 16px 0; }
    .m-cart__promo input { flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 12px; font-size: 13.5px; }
    .m-cart__promo button { background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 0 20px; font-weight: 700; }
    .m-cart__summary { background: #fff; margin: 16px; border-radius: 10px; padding: 16px; }
    .m-cart__summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #555; }
    .m-cart__summary-row--total { font-size: 17px; font-weight: 800; color: #1a1a2e; border-top: 1px solid #eee; margin-top: 6px; padding-top: 12px; }
    .m-cart__checkout { display: block; width: calc(100% - 32px); margin: 0 16px; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 15px; font-weight: 700; font-size: 15px; }
  `]
})
export class MobileCart {
  cart = inject(CartService);
  router = inject(Router);
  drawerOpen = signal(false);

  formatPrice(p: number): string {
    return inr(p);
  }
}
