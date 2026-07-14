import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { categoryIconPath } from '../../core/utils/icon.utils';
import { CATEGORIES } from '../../pages/home/home';
import { MobileTopBar } from '../shell/mobile-top-bar';
import { MobileBottomNav } from '../shell/mobile-bottom-nav';
import { MobileDrawer } from '../shell/mobile-drawer';

@Component({
  selector: 'app-mobile-categories',
  standalone: true,
  imports: [RouterLink, MobileTopBar, MobileBottomNav, MobileDrawer],
  template: `
    <app-mobile-top-bar (menu)="drawerOpen.set(true)"></app-mobile-top-bar>
    <div class="m-cat">
      <h1 class="m-cat__title">Shop by Category</h1>
      <div class="m-cat__grid">
        @for (cat of categories; track cat.name) {
          <a [routerLink]="['/m/products', cat.name]" class="m-cat__tile">
            <div class="m-cat__img-wrap"><img [src]="categoryIcon(cat.name)" [alt]="cat.name" /></div>
            <div class="m-cat__name">{{ cat.name }}</div>
            <div class="m-cat__sub">{{ cat.sub }}</div>
            <div class="m-cat__count">{{ cat.count }}</div>
          </a>
        }
      </div>
    </div>
    <app-mobile-bottom-nav active="categories"></app-mobile-bottom-nav>
    @if (drawerOpen()) {
      <app-mobile-drawer (close)="drawerOpen.set(false)"></app-mobile-drawer>
    }
  `,
  styles: [`
    .m-cat { background: #f5f5f7; min-height: calc(100vh - 140px); padding-bottom: 16px; }
    .m-cat__title { font-size: 19px; font-weight: 800; color: #1a1a2e; padding: 18px 16px 4px; }
    .m-cat__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px 16px; }
    .m-cat__tile { background: #fff; border-radius: 10px; text-decoration: none; color: inherit; display: block; padding: 14px; }
    .m-cat__img-wrap { display: flex; align-items: center; justify-content: center; height: 56px; margin-bottom: 8px; }
    .m-cat__img-wrap img { max-width: 44px; max-height: 44px; object-fit: contain; }
    .m-cat__name { text-align: center; font-size: 13px; font-weight: 700; color: #1a1a2e; }
    .m-cat__sub { text-align: center; font-size: 10.5px; color: #888; margin-top: 2px; }
    .m-cat__count { text-align: center; font-size: 10.5px; color: var(--color-primary, #70284e); font-weight: 700; margin-top: 4px; }
  `]
})
export class MobileCategories {
  private theme = inject(ThemeService);
  categories = CATEGORIES;
  drawerOpen = signal(false);

  categoryIcon(category: string): string {
    return categoryIconPath(category, this.theme.theme());
  }
}
