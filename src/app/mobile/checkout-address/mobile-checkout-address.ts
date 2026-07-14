import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../../core/services/checkout.service';
import { Address } from '../../core/models/product.model';
import { inr } from '../../core/utils/price.utils';
import { AddressForm } from '../../shared/address-form/address-form';
import { MobileBackHeader } from '../shell/mobile-back-header';

@Component({
  selector: 'app-mobile-checkout-address',
  standalone: true,
  imports: [CommonModule, AddressForm, MobileBackHeader],
  template: `
    <app-mobile-back-header title="Select Delivery Address" step="2/4"></app-mobile-back-header>
    <div class="m-addr">
      @for (a of checkout.savedAddresses(); track $index) {
        <div class="m-addr__card" [class.selected]="selected() === $index" (click)="selected.set($index)">
          <div class="m-addr__row-top">
            <span class="m-addr__radio" [class.checked]="selected() === $index"></span>
            @if (a.label) { <span class="m-addr__badge">{{ a.label | uppercase }}</span> }
          </div>
          <div class="m-addr__name">{{ a.firstName }} {{ a.lastName }}</div>
          @if (a.company) { <div class="m-addr__company">{{ a.company }}</div> }
          <div class="m-addr__lines">{{ a.address1 }}, {{ a.address2 }}, {{ a.city }}, {{ a.state }} - {{ a.zip }}</div>
          @if (a.phone) { <div class="m-addr__phone">Phone: {{ a.phone }}</div> }
        </div>
      }

      @if (!showAddForm()) {
        <button class="m-addr__add" (click)="showAddForm.set(true)">+ Add New Address</button>
      } @else {
        <div class="m-addr__form-wrap">
          <app-address-form [showDefaultToggle]="true" saveLabel="Save Address" (save)="onSaveNewAddress($event)"></app-address-form>
          <button class="m-addr__cancel" (click)="showAddForm.set(false)">Cancel</button>
        </div>
      }

      <div class="m-addr__section-label">SHIPPING METHOD</div>
      @for (m of checkout.shippingMethods; track m.id) {
        <div class="m-addr__method" [class.selected]="selectedMethod() === m.id" (click)="selectedMethod.set(m.id)">
          <span class="m-addr__radio" [class.checked]="selectedMethod() === m.id"></span>
          <div class="m-addr__method-info">
            <div class="m-addr__method-label">{{ m.label }}</div>
          </div>
          <div class="m-addr__method-price">{{ m.price === 0 ? 'FREE' : formatPrice(m.price) }}</div>
        </div>
      }
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
    .m-addr__radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #ccc; display: inline-block; position: relative; flex-shrink: 0; }
    .m-addr__radio.checked { border-color: var(--color-primary, #70284e); }
    .m-addr__radio.checked::after { content: ''; position: absolute; inset: 4px; border-radius: 50%; background: var(--color-primary, #70284e); }
    .m-addr__badge { background: #f0f0f3; color: #555; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 4px; }
    .m-addr__name { font-size: 16px; font-weight: 800; color: #1a1a2e; margin-bottom: 2px; }
    .m-addr__company { font-size: 13px; color: #666; margin-bottom: 4px; }
    .m-addr__lines { font-size: 13.5px; color: #666; line-height: 1.4; margin-bottom: 6px; }
    .m-addr__phone { font-size: 13.5px; font-weight: 700; color: #333; }
    .m-addr__add { width: 100%; border: 2px dashed #ddd; background: none; border-radius: 12px; padding: 16px; color: var(--color-primary, #70284e); font-weight: 700; margin-bottom: 20px; }
    .m-addr__form-wrap { background: #fff; border-radius: 12px; margin-bottom: 20px; overflow: hidden; }
    .m-addr__cancel { width: 100%; background: none; border: none; padding: 14px; color: #888; font-weight: 700; border-top: 1px solid #eee; }
    .m-addr__section-label { font-size: 12px; font-weight: 800; color: #888; letter-spacing: 0.5px; margin-bottom: 10px; }
    .m-addr__method { display: flex; align-items: center; gap: 12px; background: #fff; border: 2px solid #eee; border-radius: 10px; padding: 14px; margin-bottom: 10px; }
    .m-addr__method.selected { border-color: var(--color-primary, #70284e); }
    .m-addr__method-info { flex: 1; }
    .m-addr__method-label { font-size: 14px; font-weight: 700; color: #1a1a2e; }
    .m-addr__method-price { font-weight: 800; font-size: 13.5px; color: #1a1a2e; }
    .m-addr__footer { padding: 14px 16px; background: #fff; border-top: 1px solid #eee; }
    .m-addr__continue { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 15px; font-weight: 700; font-size: 15px; }
  `]
})
export class MobileCheckoutAddress {
  checkout = inject(CheckoutService);
  router = inject(Router);
  selected = signal(0);
  selectedMethod = signal('standard');
  showAddForm = signal(false);

  onSaveNewAddress(event: { address: Address; setDefault: boolean }) {
    this.checkout.addSavedAddress(event.address, event.setDefault);
    this.selected.set(this.checkout.savedAddresses().length - 1);
    this.showAddForm.set(false);
  }

  continue() {
    this.checkout.shippingAddress.set(this.checkout.savedAddresses()[this.selected()]);
    this.checkout.shippingMethod.set(
      this.checkout.shippingMethods.find(m => m.id === this.selectedMethod())!
    );
    this.router.navigate(['/m/checkout/payment']);
  }

  formatPrice(p: number): string {
    return inr(p);
  }
}
