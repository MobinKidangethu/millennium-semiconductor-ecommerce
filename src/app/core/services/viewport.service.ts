import { Injectable, signal } from '@angular/core';

const MOBILE_BREAKPOINT = 768;

@Injectable({ providedIn: 'root' })
export class ViewportService {
  private _isMobile = signal<boolean>(this.computeIsMobile());
  isMobile = this._isMobile.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this._isMobile.set(this.computeIsMobile()));
    }
  }

  private computeIsMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  }
}
