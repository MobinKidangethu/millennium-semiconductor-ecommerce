import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-mobile-bottom-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="m-bottomnav">
      <a routerLink="/" class="m-bottomnav__item" [class.active]="active() === 'home'">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z" [attr.stroke]="active()==='home' ? primaryColor : '#8a8f98'" stroke-width="1.8" stroke-linejoin="round"/></svg>
        <span>Home</span>
      </a>
      <a routerLink="/m/search" class="m-bottomnav__item" [class.active]="active() === 'search'">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" [attr.stroke]="active()==='search' ? primaryColor : '#8a8f98'" stroke-width="1.8"/><path d="m20 20-3.8-3.8" [attr.stroke]="active()==='search' ? primaryColor : '#8a8f98'" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span>Search</span>
      </a>
      <a routerLink="/m/categories" class="m-bottomnav__item" [class.active]="active() === 'categories'">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="7" height="7" rx="1.2" [attr.stroke]="active()==='categories' ? primaryColor : '#8a8f98'" stroke-width="1.7"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2" [attr.stroke]="active()==='categories' ? primaryColor : '#8a8f98'" stroke-width="1.7"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2" [attr.stroke]="active()==='categories' ? primaryColor : '#8a8f98'" stroke-width="1.7"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.2" [attr.stroke]="active()==='categories' ? primaryColor : '#8a8f98'" stroke-width="1.7"/></svg>
        <span>Categories</span>
      </a>
      <a routerLink="/cart" class="m-bottomnav__item" [class.active]="active() === 'cart'">
        <span class="m-bottomnav__cart-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.2a1.5 1.5 0 0 0 1.48 1.3h8.44a1.5 1.5 0 0 0 1.48-1.24L20.5 8H6" [attr.stroke]="active()==='cart' ? primaryColor : '#8a8f98'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20.5" r="1.4" [attr.fill]="active()==='cart' ? primaryColor : '#8a8f98'"/><circle cx="17.5" cy="20.5" r="1.4" [attr.fill]="active()==='cart' ? primaryColor : '#8a8f98'"/></svg>
          @if (cart.itemCount() > 0) {
            <span class="m-bottomnav__badge">{{ cart.itemCount() }}</span>
          }
        </span>
        <span>Cart</span>
      </a>
      <a routerLink="/m/account" class="m-bottomnav__item" [class.active]="active() === 'account'">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" [attr.stroke]="active()==='account' ? primaryColor : '#8a8f98'" stroke-width="1.8"/><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" [attr.stroke]="active()==='account' ? primaryColor : '#8a8f98'" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span>Account</span>
      </a>
    </nav>
  `,
  styles: [`
    .m-bottomnav {
      display: flex; align-items: stretch; justify-content: space-around;
      background: #fff; border-top: 1px solid #eee;
      position: sticky; bottom: 0; z-index: 30;
      padding: 8px 0 10px;
    }
    .m-bottomnav__item {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      text-decoration: none; color: #8a8f98; font-size: 11px; flex: 1;
    }
    .m-bottomnav__item.active { color: var(--color-primary, #70284e); font-weight: 700; }
    .m-bottomnav__cart-wrap { position: relative; }
    .m-bottomnav__badge {
      position: absolute; top: -6px; right: -8px; background: var(--color-primary, #70284e);
      color: #fff; font-size: 10px; font-weight: 700; border-radius: 999px;
      min-width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;
      padding: 0 3px;
    }
  `]
})
export class MobileBottomNav {
  active = input<string>('');
  cart = inject(CartService);
  primaryColor = '#70284e';
}
