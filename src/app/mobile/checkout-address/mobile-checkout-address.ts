import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../../core/services/checkout.service';
import { MobileBackHeader } from '../shell/mobile-back-header';

@Component({
  selector: 'app-mobile-checkout-address',
  standalone: true,
  imports: [CommonModule, MobileBackHeader],
  template: `
    <app-mobile-back-header title="Select Delivery Address" step="2/4"></app-mobile-back-header>
    <div class="m-addr">
      @for (a of checkout.savedAddresses(); track $index) {
        <div class="m-addr__card" [class.selected]="selected() === $index" (click)="selected.set($index)">
          <div class="m-addr__row-top">
            <span class="m-addr__radio" [class.checked]="selected() === $index"></span>
            <span class="m-addr__badge">{{ (a.label || 'HOME') | uppercase }}</span>
            <button class="m-addr__edit">✎</button>
          </div>
          <div class="m-addr__name">{{ a.firstName }} {{ a.lastName }}</div>
          <div class="m-addr__lines">{{ a.address1 }}, {{ a.address2 }}, {{ a.city }} - {{ a.zip }}</div>
          <div class="m-addr__phone">Phone: {{ a.phone || '+91 98765 43210' }}</div>
        </div>
      }

      <button class="m-addr__add">+ Add New Address</button>
    </div>
    <div class="m-addr__footer">
      <button class="m-addr__continue" (click)="continue()">Continue to Payment</button>
    </div>
  `,
  styles: [`
    .m-addr { background: #f5f5f7; min-height: calc(100vh - 130px); padding: 16px; }
    .m-addr__card { background: #fff; border: 2px solid #eee; border-radius: 12px; padding: 16px; margin-bottom: 14px; }
    .m-addr__card.selected { border-color: var(--color-primary, #70284e); }
    .m-addr__row-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .m-addr__radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #ccc; display: inline-block; position: relative; }
    .m-addr__radio.checked { border-color: var(--color-primary, #70284e); }
    .m-addr__radio.checked::after { content: ''; position: absolute; inset: 4px; border-radius: 50%; background: var(--color-primary, #70284e); }
    .m-addr__badge { background: #f0f0f3; color: #555; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 4px; }
    .m-addr__edit { margin-left: auto; background: none; border: none; color: #888; }
    .m-addr__name { font-size: 16px; font-weight: 800; color: #1a1a2e; margin-bottom: 4px; }
    .m-addr__lines { font-size: 13.5px; color: #666; line-height: 1.4; margin-bottom: 6px; }
    .m-addr__phone { font-size: 13.5px; font-weight: 700; color: #333; }
    .m-addr__add { width: 100%; border: 2px dashed #ddd; background: none; border-radius: 12px; padding: 16px; color: var(--color-primary, #70284e); font-weight: 700; }
    .m-addr__footer { padding: 14px 16px; background: #fff; border-top: 1px solid #eee; }
    .m-addr__continue { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 15px; font-weight: 700; font-size: 15px; }
  `]
})
export class MobileCheckoutAddress {
  checkout = inject(CheckoutService);
  router = inject(Router);
  selected = signal(0);

  continue() {
    this.checkout.shippingAddress.set(this.checkout.savedAddresses()[this.selected()]);
    this.router.navigate(['/m/checkout/payment']);
  }
}
