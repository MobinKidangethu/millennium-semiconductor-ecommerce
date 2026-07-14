import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { MobileBottomNav } from '../shell/mobile-bottom-nav';

const RECENT = ['ARM Cortex M33', 'NXP LPC55S69', 'IN4007 Diode', 'STM32 microcontroller'];
const TRENDING = ['Microcontrollers', 'Diodes', 'Capacitors', 'Resistors', 'MOSFETs', 'Arduino', 'Raspberry Pi', 'Voltage Regulators'];

@Component({
  selector: 'app-mobile-search',
  standalone: true,
  imports: [FormsModule, MobileBottomNav],
  template: `
    <header class="m-search-header">
      <button class="m-search-header__back" (click)="location.back()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1a1a2e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="m-search-header__box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="#999" stroke-width="1.8"/><path d="m20 20-3.8-3.8" stroke="#999" stroke-width="1.8" stroke-linecap="round"/></svg>
        <input [(ngModel)]="query" (keyup.enter)="doSearch(query)" placeholder="Search components, parts..." />
      </div>
    </header>

    <div class="m-search">
      <div class="m-search__row">
        <h2 class="m-search__heading">Recent Searches</h2>
        <button class="m-search__clear" (click)="recent.set([])">Clear all</button>
      </div>
      @for (r of recent(); track r) {
        <div class="m-search__recent-item" (click)="doSearch(r)">
          <span class="m-search__recent-icon">🕐</span>
          <span class="m-search__recent-text">{{ r }}</span>
          <button class="m-search__recent-x" (click)="removeRecent(r, $event)">✕</button>
        </div>
      }

      <h2 class="m-search__heading" style="margin-top:24px">Trending Searches</h2>
      <div class="m-search__chips">
        @for (t of trending; track t) {
          <button class="m-search__chip" (click)="doSearch(t)">{{ t }}</button>
        }
      </div>
    </div>

    <app-mobile-bottom-nav active="search"></app-mobile-bottom-nav>
  `,
  styles: [`
    .m-search-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: #fff; border-bottom: 1px solid #eee; }
    .m-search-header__back { background: none; border: none; padding: 4px; }
    .m-search-header__box { flex: 1; display: flex; align-items: center; gap: 10px; background: #f2f2f5; border-radius: 999px; padding: 10px 16px; }
    .m-search-header__box input { border: none; background: none; outline: none; flex: 1; font-size: 14px; }
    .m-search { background: #fff; padding: 18px 16px; min-height: calc(100vh - 200px); }
    .m-search__row { display: flex; align-items: center; justify-content: space-between; }
    .m-search__heading { font-size: 17px; font-weight: 800; color: #1a1a2e; margin: 0; }
    .m-search__clear { color: var(--color-primary, #70284e); font-weight: 700; background: none; border: none; font-size: 13.5px; }
    .m-search__recent-item { display: flex; align-items: center; gap: 12px; padding: 13px 0; border-bottom: 1px solid #f4f4f4; }
    .m-search__recent-icon { color: #999; }
    .m-search__recent-text { flex: 1; font-size: 14.5px; color: #333; }
    .m-search__recent-x { background: none; border: none; color: #999; }
    .m-search__chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
    .m-search__chip { background: #f2f2f5; border: none; border-radius: 999px; padding: 10px 16px; font-size: 13.5px; font-weight: 600; color: #333; }
  `]
})
export class MobileSearch {
  location = inject(Location);
  router = inject(Router);
  query = '';
  recent = signal<string[]>([...RECENT]);
  trending = TRENDING;

  removeRecent(r: string, ev: Event) {
    ev.stopPropagation();
    this.recent.update(list => list.filter(x => x !== r));
  }

  doSearch(q: string) {
    if (!q) return;
    this.router.navigate(['/m/products'], { queryParams: { q } });
  }
}
