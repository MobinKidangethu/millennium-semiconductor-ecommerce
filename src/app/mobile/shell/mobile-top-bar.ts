import { Component, output } from '@angular/core';

@Component({
  selector: 'app-mobile-top-bar',
  standalone: true,
  template: `
    <header class="m-topbar">
      <button class="m-topbar__icon" (click)="menu.emit()" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <img class="m-topbar__logo" src="assets/Millenium_Logo_new.png" alt="Millennium Digital" />
      <button class="m-topbar__icon" aria-label="Notifications">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2a6 6 0 0 0-6 6v3.2c0 .6-.2 1.2-.6 1.7L4 15h16l-1.4-2.1c-.4-.5-.6-1.1-.6-1.7V8a6 6 0 0 0-6-6Z" stroke="#1a1a2e" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="#1a1a2e" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </header>
  `,
  styles: [`
    .m-topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; background: #fff; border-bottom: 1px solid #eee;
      position: sticky; top: 0; z-index: 30;
    }
    .m-topbar__icon { background: none; border: none; padding: 6px; display: flex; }
    .m-topbar__logo { height: 30px; width: auto; object-fit: contain; }
  `]
})
export class MobileTopBar {
  menu = output<void>();
}
