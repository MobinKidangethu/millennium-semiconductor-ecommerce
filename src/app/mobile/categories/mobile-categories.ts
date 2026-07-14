import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MobileTopBar } from '../shell/mobile-top-bar';
import { MobileBottomNav } from '../shell/mobile-bottom-nav';
import { MobileDrawer } from '../shell/mobile-drawer';
import { signal } from '@angular/core';

interface CategoryTile { name: string; slug: string; img: string; }

const TILES: CategoryTile[] = [
  { name: 'Newest Products', slug: 'newest', img: 'assets/icons/categories/semiconductors.svg' },
  { name: 'Semiconductors', slug: 'Semiconductors', img: 'assets/icons/categories/semiconductors.svg' },
  { name: 'Circuit Protection', slug: 'Circuit Protection', img: 'assets/icons/categories/circuit-protection.svg' },
  { name: 'Connectors', slug: 'Connectors', img: 'assets/icons/categories/connectors.svg' },
  { name: 'Electromechanical', slug: 'Electromechanical', img: 'assets/icons/categories/electromechanical.svg' },
  { name: 'Embedded Solutions', slug: 'Embedded Solutions', img: 'assets/icons/categories/memory-storage.svg' },
  { name: 'Industrial Automation', slug: 'Industrial Automation', img: 'assets/icons/categories/electromechanical.svg' },
  { name: 'LED Lighting', slug: 'LED Lighting', img: 'assets/icons/categories/led-lighting.svg' },
  { name: 'Memory & Data Storage', slug: 'Memory & Storage', img: 'assets/icons/categories/memory-storage.svg' },
  { name: 'Opto-electronics', slug: 'Opto-electronics', img: 'assets/icons/categories/led-lighting.svg' },
  { name: 'Passive Components', slug: 'Passive Components', img: 'assets/icons/categories/passive-components.svg' },
  { name: 'Power', slug: 'Power', img: 'assets/icons/categories/power.svg' },
  { name: 'RF & Wireless', slug: 'RF & Wireless', img: 'assets/icons/categories/rf-wireless.svg' },
  { name: 'Sensors', slug: 'Sensors', img: 'assets/icons/categories/sensors.svg' },
  { name: 'Test & Measurement', slug: 'Test & Measurement', img: 'assets/icons/categories/thermal-management.svg' },
  { name: 'Thermal Management', slug: 'Thermal Management', img: 'assets/icons/categories/thermal-management.svg' },
  { name: 'Tools & Supplies', slug: 'Tools & Supplies', img: 'assets/icons/categories/tools-supplies.svg' },
  { name: 'Wire & Cable', slug: 'Wire & Cable', img: 'assets/icons/categories/connectors.svg' },
];

@Component({
  selector: 'app-mobile-categories',
  standalone: true,
  imports: [RouterLink, MobileTopBar, MobileBottomNav, MobileDrawer],
  template: `
    <app-mobile-top-bar (menu)="drawerOpen.set(true)"></app-mobile-top-bar>
    <div class="m-cat">
      <h1 class="m-cat__title">CATEGORIES</h1>
      <div class="m-cat__grid">
        @for (t of tiles; track t.name) {
          <a [routerLink]="['/m/products', t.slug]" class="m-cat__tile">
            <div class="m-cat__img-wrap"><img [src]="t.img" [alt]="t.name" /></div>
            <div class="m-cat__name">{{ t.name }}</div>
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
    .m-cat { background: #fff; min-height: calc(100vh - 140px); padding-bottom: 16px; }
    .m-cat__title { font-size: 20px; font-weight: 800; color: #1a1a2e; padding: 18px 16px 6px; letter-spacing: 0.5px; }
    .m-cat__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #eee; }
    .m-cat__tile { background: #fafafa; text-decoration: none; color: inherit; display: flex; flex-direction: column; }
    .m-cat__img-wrap { aspect-ratio: 1.1; display: flex; align-items: center; justify-content: center; padding: 14px; }
    .m-cat__img-wrap img { max-width: 70%; max-height: 70%; object-fit: contain; }
    .m-cat__name { text-align: center; font-size: 12px; font-weight: 600; color: #1a1a2e; padding: 0 6px 12px; line-height: 1.25; }
  `]
})
export class MobileCategories {
  tiles = TILES;
  drawerOpen = signal(false);
}
