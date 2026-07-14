import { Component, input } from '@angular/core';
import { Location } from '@angular/common';
import { inject } from '@angular/core';

@Component({
  selector: 'app-mobile-back-header',
  standalone: true,
  template: `
    <header class="m-backheader">
      <button class="m-backheader__back" (click)="location.back()" aria-label="Back">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1a1a2e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <h1 class="m-backheader__title">{{ title() }}</h1>
      @if (step()) {
        <span class="m-backheader__step">{{ step() }}</span>
      } @else {
        <span class="m-backheader__spacer"></span>
      }
    </header>
  `,
  styles: [`
    .m-backheader {
      display: flex; align-items: center; gap: 12px;
      padding: 16px; background: #fff; border-bottom: 1px solid #eee;
      position: sticky; top: 0; z-index: 30;
    }
    .m-backheader__back { background: none; border: none; padding: 4px; display: flex; }
    .m-backheader__title { flex: 1; font-size: 19px; font-weight: 700; color: #1a1a2e; margin: 0; }
    .m-backheader__step { font-size: 15px; font-weight: 700; color: var(--color-primary, #70284e); }
    .m-backheader__spacer { width: 22px; }
  `]
})
export class MobileBackHeader {
  title = input<string>('');
  step = input<string>('');
  location = inject(Location);
}
