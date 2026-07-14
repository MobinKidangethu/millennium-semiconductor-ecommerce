import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { inr } from '../../core/utils/price.utils';
import { MobileBackHeader } from '../shell/mobile-back-header';

@Component({
  selector: 'app-mobile-checkout-payment',
  standalone: true,
  imports: [FormsModule, CommonModule, MobileBackHeader],
  template: `
    <app-mobile-back-header title="Payment Method" step="3/4"></app-mobile-back-header>
    <div class="m-pay">
      <div class="m-pay__option" [class.selected]="method() === 'upi'" (click)="method.set('upi')">
        <div class="m-pay__option-head">
          <span class="m-pay__radio" [class.checked]="method() === 'upi'"></span>
          <span>⚡ UPI (PhonePe, GPay)</span>
        </div>
        @if (method() === 'upi') {
          <div class="m-pay__upi-body">
            <label>UPI ID</label>
            <input [(ngModel)]="upiId" placeholder="yourname@bank" />
            <div class="m-pay__linked-label">Linked UPI Apps</div>
            <div class="m-pay__linked-apps">
              <span class="m-pay__app">📱 PhonePe</span>
              <span class="m-pay__app">G Pay</span>
            </div>
          </div>
        }
      </div>

      <div class="m-pay__option" [class.selected]="method() === 'card'" (click)="method.set('card')">
        <span class="m-pay__radio" [class.checked]="method() === 'card'"></span>
        <span>💳 Credit / Debit Card</span>
      </div>
      <div class="m-pay__option" [class.selected]="method() === 'netbanking'" (click)="method.set('netbanking')">
        <span class="m-pay__radio" [class.checked]="method() === 'netbanking'"></span>
        <span>🏦 Net Banking</span>
      </div>
      <div class="m-pay__option" [class.selected]="method() === 'cod'" (click)="method.set('cod')">
        <span class="m-pay__radio" [class.checked]="method() === 'cod'"></span>
        <span>🚚 Cash on Delivery</span>
      </div>

      <div class="m-pay__summary">
        <div class="m-pay__summary-row"><span>Subtotal</span><span>{{ formatPrice(cart.subtotal()) }}</span></div>
        <div class="m-pay__summary-row m-pay__summary-row--total"><span>Total Payable</span><span>{{ formatPrice(cart.total()) }}</span></div>
      </div>
    </div>
    <div class="m-pay__footer">
      <button class="m-pay__review" (click)="review()">Review Order</button>
    </div>
  `,
  styles: [`
    .m-pay { background: #f5f5f7; min-height: calc(100vh - 200px); padding: 16px; }
    .m-pay__option { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; color: #1a1a2e; flex-wrap: wrap; }
    .m-pay__option-head { display: flex; align-items: center; gap: 12px; width: 100%; }
    .m-pay__radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #ccc; display: inline-block; position: relative; flex-shrink: 0; }
    .m-pay__radio.checked { border-color: var(--color-primary, #70284e); }
    .m-pay__radio.checked::after { content: ''; position: absolute; inset: 4px; border-radius: 50%; background: var(--color-primary, #70284e); }
    .m-pay__upi-body { width: 100%; margin-top: 14px; }
    .m-pay__upi-body label { display: block; font-size: 12.5px; color: #888; margin-bottom: 6px; }
    .m-pay__upi-body input { width: 100%; box-sizing: border-box; border: 1px solid #ddd; border-radius: 8px; padding: 12px; font-size: 14px; margin-bottom: 14px; }
    .m-pay__linked-label { font-size: 12.5px; color: #888; margin-bottom: 8px; }
    .m-pay__linked-apps { display: flex; gap: 10px; }
    .m-pay__app { border: 1px solid #ddd; border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 600; }
    .m-pay__summary { background: #fff; border-radius: 12px; padding: 16px; margin-top: 20px; }
    .m-pay__summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; padding: 6px 0; }
    .m-pay__summary-row--total { font-weight: 800; font-size: 17px; color: #1a1a2e; border-top: 1px solid #eee; margin-top: 6px; padding-top: 12px; }
    .m-pay__footer { padding: 14px 16px; background: #fff; border-top: 1px solid #eee; }
    .m-pay__review { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 15px; font-weight: 700; font-size: 15px; }
  `]
})
export class MobileCheckoutPayment {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  router = inject(Router);
  method = signal<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  upiId = '';

  review() {
    this.checkout.paymentMethod.set(this.method());
    this.router.navigate(['/m/checkout/review']);
  }

  formatPrice(p: number): string {
    return inr(p);
  }
}
