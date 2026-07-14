import { Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { inr } from '../../core/utils/price.utils';
import { MobileBackHeader } from '../shell/mobile-back-header';

const UPI_LIMIT = 100000;

@Component({
  selector: 'app-mobile-checkout-payment',
  standalone: true,
  imports: [FormsModule, CommonModule, MobileBackHeader],
  template: `
    <app-mobile-back-header title="Payment Method" step="3/4"></app-mobile-back-header>
    <div class="m-pay">
      @for (m of paymentMethods; track m.id) {
        <div class="m-pay__option" [class.selected]="activePayment() === m.id" [class.disabled]="m.id === 'upi' && !upiEligible()" (click)="selectPayment(m.id)">
          <div class="m-pay__option-head">
            <span class="m-pay__radio" [class.checked]="activePayment() === m.id"></span>
            <span>{{ m.icon }} {{ m.label }}</span>
          </div>

          @if (activePayment() === m.id) {
            @switch (m.id) {
              @case ('credit') {
                <div class="m-pay__body">
                  <label>Name on Card</label>
                  <input [ngModel]="checkout.cardHolder()" (ngModelChange)="checkout.cardHolder.set($event)" placeholder="Full name" />
                  <label>Card Number</label>
                  <input [ngModel]="checkout.cardNumber()" (ngModelChange)="checkout.cardNumber.set($event)" placeholder="•••• •••• •••• ••••" />
                  <label>Expiry</label>
                  <input [ngModel]="checkout.cardExpiry()" (ngModelChange)="checkout.cardExpiry.set($event)" placeholder="MM / YY" />
                </div>
              }
              @case ('upi') {
                <div class="m-pay__body">
                  @if (!upiEligible()) {
                    <p class="m-pay__notice">UPI is only available for orders up to {{ formatPrice(upiLimit) }}.</p>
                  } @else {
                    <label>UPI ID</label>
                    <input [ngModel]="checkout.upiId()" (ngModelChange)="checkout.upiId.set($event)" placeholder="yourname@bank" />
                  }
                </div>
              }
              @case ('wire') {
                <div class="m-pay__body">
                  <p class="m-pay__notice">Wire transfer details will be emailed after order confirmation.</p>
                  <label class="m-pay__checkbox">
                    <input type="checkbox" [ngModel]="checkout.wireAcknowledged()" (ngModelChange)="checkout.wireAcknowledged.set($event)" />
                    I acknowledge I will complete the wire transfer within 3 business days.
                  </label>
                </div>
              }
              @case ('net30') {
                <div class="m-pay__body">
                  @if (checkout.net30Applied()) {
                    <p class="m-pay__notice m-pay__notice--success">Approved — Credit limit {{ formatPrice(checkout.net30CreditLimit()) }}.</p>
                  } @else {
                    <label>Company Name</label>
                    <input [ngModel]="checkout.net30CompanyName()" (ngModelChange)="checkout.net30CompanyName.set($event)" />
                    <label>Authorized Signer</label>
                    <input [ngModel]="checkout.net30AuthorizedSigner()" (ngModelChange)="checkout.net30AuthorizedSigner.set($event)" />
                    <button class="m-pay__apply-btn" (click)="applyNet30()" [disabled]="net30Applying()">
                      {{ net30Applying() ? 'Applying…' : 'Apply for Net 30' }}
                    </button>
                  }
                </div>
              }
              @case ('po') {
                <div class="m-pay__body">
                  <label>PO Number</label>
                  <input [ngModel]="checkout.poNumber()" (ngModelChange)="checkout.poNumber.set($event)" />
                  <label class="m-pay__checkbox">
                    <input type="checkbox" [ngModel]="checkout.poAmountConfirmed()" (ngModelChange)="checkout.poAmountConfirmed.set($event)" />
                    I confirm the PO amount matches the order total.
                  </label>
                </div>
              }
            }
          }
        </div>
      }

      <div class="m-pay__summary">
        <div class="m-pay__summary-row"><span>Subtotal</span><span>{{ formatPrice(cart.subtotal()) }}</span></div>
        <div class="m-pay__summary-row"><span>Shipping</span><span>{{ checkout.shippingMethod().price === 0 ? 'FREE' : formatPrice(checkout.shippingMethod().price) }}</span></div>
        <div class="m-pay__summary-row m-pay__summary-row--total"><span>Total Payable</span><span>{{ formatPrice(total()) }}</span></div>
      </div>
    </div>
    <div class="m-pay__footer">
      <button class="m-pay__review" [disabled]="!canContinue()" (click)="review()">Review Order</button>
    </div>
  `,
  styles: [`
    .m-pay { background: #f5f5f7; min-height: calc(100vh - 200px); padding: 16px; }
    .m-pay__option { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
    .m-pay__option.disabled { opacity: 0.5; }
    .m-pay__option-head { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; color: #1a1a2e; }
    .m-pay__radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #ccc; display: inline-block; position: relative; flex-shrink: 0; }
    .m-pay__radio.checked { border-color: var(--color-primary, #70284e); }
    .m-pay__radio.checked::after { content: ''; position: absolute; inset: 4px; border-radius: 50%; background: var(--color-primary, #70284e); }
    .m-pay__body { margin-top: 14px; }
    .m-pay__body label { display: block; font-size: 12.5px; color: #888; margin-bottom: 6px; }
    .m-pay__body input[type='text'], .m-pay__body input:not([type]) { width: 100%; box-sizing: border-box; border: 1px solid #ddd; border-radius: 8px; padding: 12px; font-size: 14px; margin-bottom: 14px; }
    .m-pay__notice { font-size: 13px; color: #666; background: #f7f7f9; padding: 10px 12px; border-radius: 8px; margin-bottom: 10px; }
    .m-pay__notice--success { background: #e6f6ec; color: #1f8a4c; }
    .m-pay__checkbox { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #555; margin-bottom: 10px; }
    .m-pay__apply-btn { background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 12px; font-weight: 700; width: 100%; }
    .m-pay__summary { background: #fff; border-radius: 12px; padding: 16px; margin-top: 20px; }
    .m-pay__summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; padding: 6px 0; }
    .m-pay__summary-row--total { font-weight: 800; font-size: 17px; color: #1a1a2e; border-top: 1px solid #eee; margin-top: 6px; padding-top: 12px; }
    .m-pay__footer { padding: 14px 16px; background: #fff; border-top: 1px solid #eee; }
    .m-pay__review { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 15px; font-weight: 700; font-size: 15px; }
    .m-pay__review:disabled { opacity: 0.5; }
  `]
})
export class MobileCheckoutPayment {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  auth = inject(AuthService);
  router = inject(Router);

  activePayment = signal('credit');
  net30Applying = signal(false);
  readonly upiLimit = UPI_LIMIT;

  paymentMethods = [
    { id: 'credit', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'upi',    label: 'UPI Payment',          icon: '📱' },
    { id: 'wire',   label: 'Wire Transfer',        icon: '🏦' },
    { id: 'net30',  label: 'Net 30 (Account Required)', icon: '📄' },
    { id: 'po',     label: 'Purchase Order',        icon: '📋' }
  ];

  upiEligible = computed(() => this.cart.total() <= UPI_LIMIT);
  total = computed(() => this.cart.total() + this.checkout.shippingMethod().price);

  constructor() {
    if (!this.checkout.cardHolder()) {
      this.checkout.cardHolder.set(this.auth.currentUser()?.name ?? '');
    }
    if (!this.checkout.net30CompanyName()) {
      this.checkout.net30CompanyName.set(this.checkout.shippingAddress().company ?? '');
    }
  }

  selectPayment(id: string) {
    if (id === 'upi' && !this.upiEligible()) return;
    this.activePayment.set(id);
  }

  applyNet30() {
    if (!this.checkout.net30CompanyName() || !this.checkout.net30AuthorizedSigner()) return;
    this.net30Applying.set(true);
    setTimeout(() => {
      this.net30Applying.set(false);
      this.checkout.net30Applied.set(true);
      this.checkout.net30CreditLimit.set(500000);
    }, 1200);
  }

  canContinue = computed(() => {
    switch (this.activePayment()) {
      case 'upi': return this.upiEligible();
      case 'wire': return this.checkout.wireAcknowledged();
      case 'net30': return this.checkout.net30Applied();
      case 'po': return !!this.checkout.poNumber() && this.checkout.poAmountConfirmed();
      default: return true;
    }
  });

  review() {
    if (!this.canContinue()) return;
    this.checkout.paymentMethod.set(this.activePayment());
    this.router.navigate(['/m/checkout/review']);
  }

  formatPrice(p: number): string {
    return inr(p);
  }
}
