import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mobile-auth-header',
  standalone: true,
  template: `
    <header class="m-authheader">
      <button class="m-authheader__icon" (click)="location.back()" aria-label="Close">
        @if (variant() === 'close') {
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/></svg>
        } @else {
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1a1a2e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        }
      </button>
      <img class="m-authheader__logo" src="assets/Millenium_Logo_new.png" alt="Millennium Digital" />
      <span class="m-authheader__spacer"></span>
    </header>
  `,
  styles: [`
    .m-authheader {
      display: flex; align-items: center; padding: 16px; background: #fff; border-bottom: 1px solid #eee;
    }
    .m-authheader__icon { background: none; border: none; padding: 4px; }
    .m-authheader__logo { height: 26px; flex: 1; margin: 0 auto; display: block; }
    .m-authheader__spacer { width: 22px; }
  `]
})
export class MobileAuthHeader {
  variant = input<'back' | 'close'>('back');
  location = inject(Location);
}
