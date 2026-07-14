import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { inr } from '../../core/utils/price.utils';
import { paymentMethodLabel } from '../../core/utils/payment.utils';
import { BackorderBadge } from '../../shared/backorder-badge/backorder-badge';
import { MobileBackHeader } from '../shell/mobile-back-header';

type PaymentStep = 'idle' | 'gateway' | 'otp' | 'upi-waiting' | 'verifying' | 'success';

@Component({
  selector: 'app-mobile-checkout-review',
  standalone: true,
  imports: [FormsModule, CommonModule, BackorderBadge, MobileBackHeader],
  template: `
    <app-mobile-back-header title="Order Summary" step="4/4"></app-mobile-back-header>
    <div class="m-review">
      <div class="m-review__card">
        <div class="m-review__card-head"><span>DELIVER TO</span></div>
        <div class="m-review__name">{{ checkout.shippingAddress().firstName }} {{ checkout.shippingAddress().lastName }}</div>
        <div class="m-review__addr">{{ checkout.shippingAddress().address1 }}, {{ checkout.shippingAddress().city }} - {{ checkout.shippingAddress().zip }}</div>
      </div>

      <div class="m-review__card">
        <div class="m-review__card-head"><span>PAYMENT METHOD</span></div>
        <div class="m-review__name">{{ paymentLabel(checkout.paymentMethod()) }}</div>
      </div>

      <div class="m-review__items-label">ORDER ITEMS ({{ cart.items().length }})</div>
      @for (item of cart.items(); track item.product.id) {
        <div class="m-review__item">
          <img [src]="item.product.image" [alt]="item.product.title" />
          <div class="m-review__item-info">
            <div class="m-review__item-mfr">{{ item.product.manufacturer }}</div>
            <div class="m-review__item-pn">{{ item.product.manufacturerPartNumber }}</div>
            <div class="m-review__item-qty">Qty: {{ item.qty }}</div>
            <app-backorder-badge [product]="item.product" [qty]="item.qty"></app-backorder-badge>
          </div>
          <div class="m-review__item-price">{{ formatPrice(item.product.price * item.qty) }}</div>
        </div>
      }

      <div class="m-review__totals">
        <div class="m-review__totals-row"><span>Subtotal</span><span>{{ formatPrice(cart.subtotal()) }}</span></div>
        <div class="m-review__totals-row"><span>Shipping ({{ checkout.shippingMethod().label }})</span><span>{{ checkout.shippingMethod().price === 0 ? 'FREE' : formatPrice(checkout.shippingMethod().price) }}</span></div>
        <div class="m-review__totals-row"><span>Est. Tax (18% GST)</span><span>{{ formatPrice(cart.tax()) }}</span></div>
        <div class="m-review__totals-row m-review__totals-row--total"><span>Total Amount</span><span>{{ formatPrice(grandTotal()) }}</span></div>
      </div>
    </div>
    <div class="m-review__footer">
      <button class="m-review__place" (click)="placeOrder()">Place Order — {{ formatPrice(grandTotal()) }}</button>
      <div class="m-review__ssl">🔒 SSL Encrypted Secure Payment</div>
    </div>

    @if (paymentStep() !== 'idle') {
      <div class="m-review__modal-backdrop">
        <div class="m-review__modal">
          @switch (paymentStep()) {
            @case ('gateway') {
              <div class="m-review__spinner"></div>
              <p>Connecting to payment gateway…</p>
            }
            @case ('otp') {
              <h3>Enter OTP</h3>
              <p class="m-review__modal-sub">Sent to your registered mobile number</p>
              <input class="m-review__otp-input" maxlength="6" [(ngModel)]="otpValue" placeholder="6-digit code" (input)="otpError.set(false)" />
              @if (otpError()) { <p class="m-review__otp-error">Please enter the 6-digit code.</p> }
              <button class="m-review__modal-btn" (click)="submitOtp()">Verify</button>
              <button class="m-review__modal-cancel" (click)="cancelPayment()">Cancel</button>
            }
            @case ('upi-waiting') {
              <div class="m-review__spinner"></div>
              <p>Waiting for UPI approval on your app…</p>
            }
            @case ('verifying') {
              <div class="m-review__spinner"></div>
              <p>Verifying…</p>
            }
            @case ('success') {
              <div class="m-review__success">✓</div>
              <p>Payment confirmed!</p>
            }
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .m-review { background: #f5f5f7; min-height: calc(100vh - 220px); padding: 16px; }
    .m-review__card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
    .m-review__card-head { font-size: 12px; color: #888; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 8px; }
    .m-review__name { font-size: 16px; font-weight: 800; color: #1a1a2e; }
    .m-review__addr { font-size: 13.5px; color: #666; margin-top: 4px; }
    .m-review__items-label { font-size: 12px; font-weight: 800; color: #888; letter-spacing: 0.5px; margin: 18px 0 10px; }
    .m-review__item { background: #fff; border-radius: 10px; padding: 12px; display: flex; gap: 12px; margin-bottom: 10px; align-items: flex-start; }
    .m-review__item img { width: 52px; height: 52px; object-fit: contain; border: 1px solid #eee; border-radius: 8px; padding: 4px; }
    .m-review__item-info { flex: 1; }
    .m-review__item-mfr { font-size: 11.5px; color: #888; }
    .m-review__item-pn { font-size: 14.5px; font-weight: 800; color: var(--color-primary, #70284e); }
    .m-review__item-qty { font-size: 12px; color: #666; margin-bottom: 4px; }
    .m-review__item-price { font-weight: 800; font-size: 14.5px; color: #1a1a2e; }
    .m-review__totals { background: #fff; border-radius: 12px; padding: 16px; margin-top: 8px; }
    .m-review__totals-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; padding: 6px 0; }
    .m-review__totals-row--total { font-weight: 800; font-size: 18px; color: #1a1a2e; border-top: 1px solid #eee; margin-top: 6px; padding-top: 12px; }
    .m-review__footer { padding: 14px 16px 18px; background: #fff; border-top: 1px solid #eee; }
    .m-review__place { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 15px; font-weight: 700; font-size: 15px; }
    .m-review__ssl { text-align: center; font-size: 12px; color: #888; margin-top: 10px; }
    .m-review__modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center; }
    .m-review__modal { background: #fff; border-radius: 14px; padding: 28px; text-align: center; width: 84%; max-width: 320px; }
    .m-review__modal h3 { margin: 0 0 4px; font-size: 18px; }
    .m-review__modal-sub { color: #888; font-size: 13px; margin-bottom: 16px; }
    .m-review__otp-input { width: 100%; box-sizing: border-box; text-align: center; letter-spacing: 4px; font-size: 18px; border: 1px solid #ddd; border-radius: 8px; padding: 12px; margin-bottom: 8px; }
    .m-review__otp-error { color: #c0392b; font-size: 12.5px; margin-bottom: 8px; }
    .m-review__modal-btn { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 12px; font-weight: 700; margin-top: 8px; }
    .m-review__modal-cancel { width: 100%; background: none; border: none; color: #888; padding: 10px; margin-top: 4px; }
    .m-review__spinner { width: 36px; height: 36px; border: 3px solid #eee; border-top-color: var(--color-primary, #70284e); border-radius: 50%; margin: 0 auto 16px; animation: spin 0.8s linear infinite; }
    .m-review__success { width: 48px; height: 48px; background: #2a9d5c; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class MobileCheckoutReview {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  orderService = inject(OrderService);
  auth = inject(AuthService);
  router = inject(Router);

  paymentStep = signal<PaymentStep>('idle');
  otpValue = '';
  otpError = signal(false);

  grandTotal(): number {
    return this.cart.total() + this.checkout.shippingMethod().price;
  }

  paymentLabel(id: string): string {
    return paymentMethodLabel(id);
  }

  placeOrder() {
    const method = this.checkout.paymentMethod();
    if (method === 'credit') {
      this.paymentStep.set('gateway');
      setTimeout(() => this.paymentStep.set('otp'), 1100);
    } else if (method === 'upi') {
      this.paymentStep.set('upi-waiting');
      setTimeout(() => {
        this.paymentStep.set('success');
        setTimeout(() => this.finalizeOrder(), 1100);
      }, 2000);
    } else {
      this.finalizeOrder();
    }
  }

  submitOtp() {
    if (this.otpValue.length !== 6) {
      this.otpError.set(true);
      return;
    }
    this.paymentStep.set('verifying');
    setTimeout(() => {
      this.paymentStep.set('success');
      setTimeout(() => this.finalizeOrder(), 1100);
    }, 1100);
  }

  cancelPayment() {
    this.paymentStep.set('idle');
    this.otpValue = '';
    this.otpError.set(false);
  }

  private finalizeOrder() {
    this.paymentStep.set('idle');
    const email = this.auth.currentUser()?.email ?? 'guest@example.com';
    const order = this.orderService.placeOrder({
      userEmail: email,
      items: this.cart.items(),
      subtotal: this.cart.subtotal(),
      tax: this.cart.tax(),
      total: this.grandTotal(),
      shippingAddress: this.checkout.shippingAddress(),
      billingAddress: this.checkout.billingSameAsShipping() ? this.checkout.shippingAddress() : (this.checkout.billingAddress() ?? this.checkout.shippingAddress()),
      billingSameAsShipping: this.checkout.billingSameAsShipping(),
      shippingMethodLabel: this.checkout.shippingMethod().label,
      paymentMethod: this.checkout.paymentMethod(),
      invoiceType: this.checkout.invoiceType(),
      gstin: this.checkout.gstin()
    });
    this.cart.clear();
    this.router.navigate(['/m/checkout/confirmation'], { queryParams: { order: order.orderNumber } });
  }

  formatPrice(p: number): string {
    return inr(p);
  }
}
