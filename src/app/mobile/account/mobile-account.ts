import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MobileTopBar } from '../shell/mobile-top-bar';
import { MobileBottomNav } from '../shell/mobile-bottom-nav';
import { MobileDrawer } from '../shell/mobile-drawer';

@Component({
  selector: 'app-mobile-account',
  standalone: true,
  imports: [RouterLink, CommonModule, MobileTopBar, MobileBottomNav, MobileDrawer],
  template: `
    <app-mobile-top-bar (menu)="drawerOpen.set(true)"></app-mobile-top-bar>

    <div class="m-account">
      @if (auth.currentUser(); as user) {
        <div class="m-account__profile">
          <div class="m-account__avatar">{{ user.name.charAt(0) }}</div>
          <div class="m-account__info">
            <div class="m-account__name">{{ user.name }}</div>
            <div class="m-account__email">{{ user.email }}</div>
          </div>
          <a routerLink="/m/account/edit" class="m-account__edit">✎</a>
        </div>
      } @else {
        <div class="m-account__signin-card">
          <p>You're not signed in.</p>
          <a routerLink="/m/login" class="m-account__signin-btn">Sign In / Register</a>
        </div>
      }

      <div class="m-account__group">
        <a routerLink="/m/orders" class="m-account__row">
          <span class="m-account__row-icon">📦</span> My Orders <span class="m-account__chev">›</span>
        </a>
        <a class="m-account__row">
          <span class="m-account__row-icon">♡</span> Wishlist <span class="m-account__chev">›</span>
        </a>
        <a class="m-account__row">
          <span class="m-account__row-icon">📍</span> My Addresses <span class="m-account__chev">›</span>
        </a>
        <a class="m-account__row">
          <span class="m-account__row-icon">💳</span> Payment Methods <span class="m-account__chev">›</span>
        </a>
      </div>

      <div class="m-account__group">
        <a class="m-account__row">
          <span class="m-account__row-icon">🔔</span> Notifications <span class="m-account__chev">›</span>
        </a>
        <a class="m-account__row">
          <span class="m-account__row-icon">🎧</span> Help &amp; Support <span class="m-account__chev">›</span>
        </a>
        @if (auth.currentUser()) {
          <a class="m-account__row m-account__row--danger" (click)="logout()">
            <span class="m-account__row-icon">⏻</span> Logout
          </a>
        }
      </div>
    </div>

    <app-mobile-bottom-nav active="account"></app-mobile-bottom-nav>

    @if (drawerOpen()) {
      <app-mobile-drawer (close)="drawerOpen.set(false)"></app-mobile-drawer>
    }
  `,
  styles: [`
    .m-account { background: #f5f5f7; min-height: calc(100vh - 140px); padding: 16px; }
    .m-account__profile { background: #fff; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
    .m-account__avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--color-primary, #70284e); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; flex-shrink: 0; }
    .m-account__info { flex: 1; }
    .m-account__name { font-size: 18px; font-weight: 800; color: #1a1a2e; }
    .m-account__email { font-size: 13px; color: #888; margin-top: 2px; }
    .m-account__edit { color: var(--color-primary, #70284e); text-decoration: none; font-size: 18px; }
    .m-account__signin-card { background: #fff; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 16px; }
    .m-account__signin-btn { display: inline-block; margin-top: 10px; background: var(--color-primary, #70284e); color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; }
    .m-account__group { background: #fff; border-radius: 12px; margin-bottom: 16px; overflow: hidden; }
    .m-account__row { display: flex; align-items: center; gap: 14px; padding: 16px; text-decoration: none; color: #1a1a2e; font-size: 15.5px; font-weight: 600; border-bottom: 1px solid #f4f4f4; cursor: pointer; }
    .m-account__row:last-child { border-bottom: none; }
    .m-account__row-icon { width: 20px; text-align: center; }
    .m-account__chev { margin-left: auto; color: #bbb; }
    .m-account__row--danger { color: #c0392b; }
  `]
})
export class MobileAccount {
  auth = inject(AuthService);
  router = inject(Router);
  drawerOpen = signal(false);

  logout() {
    this.auth.logout();
    this.router.navigate(['/m/account']);
  }
}
