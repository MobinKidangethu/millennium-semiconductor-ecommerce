import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mobile-drawer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="m-drawer__backdrop" (click)="close.emit()"></div>
    <div class="m-drawer">
      <div class="m-drawer__header">
        <img class="m-drawer__logo" src="assets/Millenium_Logo_new.png" alt="Millennium Digital" />
        <button class="m-drawer__close" (click)="close.emit()" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>

      @if (auth.currentUser(); as user) {
        <div class="m-drawer__welcome">
          <div class="m-drawer__avatar">{{ user.name.charAt(0) }}</div>
          <div>
            <div class="m-drawer__welcome-title">{{ user.name }}</div>
            <div class="m-drawer__welcome-sub">{{ user.email }}</div>
          </div>
        </div>
      } @else {
        <div class="m-drawer__welcome">
          <div class="m-drawer__avatar-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="#fff" stroke-width="1.8"/><path d="M4.5 20c0-3.6 3.4-6.5 7.5-6.5s7.5 2.9 7.5 6.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <div>
            <div class="m-drawer__welcome-title">Welcome!</div>
            <div class="m-drawer__welcome-sub">Sign in for the best experience</div>
          </div>
        </div>
        <a routerLink="/m/login" (click)="close.emit()" class="m-drawer__signin">Sign In / Register</a>
      }

      <nav class="m-drawer__links">
        <a routerLink="/m/categories" (click)="close.emit()" class="m-drawer__link">
          <span class="m-drawer__link-icon">▦</span> Categories
        </a>
        <a routerLink="/" (click)="close.emit()" class="m-drawer__link">
          <span class="m-drawer__link-icon">🔥</span> Trending Products <span class="m-drawer__new">New</span>
        </a>
        <a routerLink="/" (click)="close.emit()" class="m-drawer__link">
          <span class="m-drawer__link-icon">✓</span> Top Manufacturers
        </a>
        <a routerLink="/" (click)="close.emit()" class="m-drawer__link">
          <span class="m-drawer__link-icon">%</span> Deals &amp; Offers
        </a>
        <a routerLink="/m/orders" (click)="close.emit()" class="m-drawer__link">
          <span class="m-drawer__link-icon">📍</span> Track Order
        </a>
        <a routerLink="/m/orders" (click)="close.emit()" class="m-drawer__link">
          <span class="m-drawer__link-icon">📦</span> My Orders
        </a>
      </nav>

      <div class="m-drawer__divider"></div>

      <nav class="m-drawer__links">
        <a routerLink="/" (click)="close.emit()" class="m-drawer__link">
          <span class="m-drawer__link-icon">?</span> Help &amp; Support
        </a>
        <a routerLink="/" (click)="close.emit()" class="m-drawer__link">
          <span class="m-drawer__link-icon">ⓘ</span> About Us
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .m-drawer__backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 90;
    }
    .m-drawer {
      position: fixed; top: 0; left: 0; bottom: 0; width: 86%; max-width: 380px;
      background: #fff; z-index: 91; overflow-y: auto;
      display: flex; flex-direction: column;
    }
    .m-drawer__header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 16px; border-bottom: 1px solid #eee;
    }
    .m-drawer__logo { height: 28px; }
    .m-drawer__close { background: none; border: none; padding: 4px; }
    .m-drawer__welcome {
      display: flex; align-items: center; gap: 14px;
      background: #1b2942; color: #fff; padding: 24px 16px;
    }
    .m-drawer__avatar, .m-drawer__avatar-icon {
      width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 700; flex-shrink: 0;
    }
    .m-drawer__welcome-title { font-size: 19px; font-weight: 800; }
    .m-drawer__welcome-sub { font-size: 13px; color: #c7cede; margin-top: 2px; }
    .m-drawer__signin {
      display: block; text-align: center; margin: 16px; padding: 13px;
      background: var(--color-primary, #70284e); color: #fff; border-radius: 8px;
      font-weight: 700; text-decoration: none; font-size: 15px;
    }
    .m-drawer__links { padding: 6px 0; }
    .m-drawer__link {
      display: flex; align-items: center; gap: 14px; padding: 15px 20px;
      color: #1a1a2e; text-decoration: none; font-size: 15.5px; font-weight: 600;
      border-bottom: 1px solid #f4f4f4;
    }
    .m-drawer__link-icon { width: 20px; text-align: center; font-size: 16px; }
    .m-drawer__new {
      margin-left: auto; background: var(--color-primary, #70284e); color: #fff;
      font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px;
    }
    .m-drawer__divider { height: 8px; background: #f5f5f7; }
  `]
})
export class MobileDrawer {
  close = output<void>();
  auth = inject(AuthService);
}
