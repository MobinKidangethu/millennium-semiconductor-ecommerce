import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { inr } from '../../core/utils/price.utils';
import { MobileBackHeader } from '../shell/mobile-back-header';

const PAYMENT_LABELS: Record<string, string> = {
  upi: 'UPI', card: 'Credit / Debit Card', netbanking: 'Net Banking', cod: 'Cash on Delivery', credit: 'Visa Ending in 4582'
};

@Component({
  selector: 'app-mobile-checkout-review',
  standalone: true,
  imports: [CommonModule, MobileBackHeader],
  template: `
    <app-mobile-back-header title="Order Summary" step="4/4"></app-mobile-back-header>
    <div class="m-review">
      <div class="m-review__card">
        <div class="m-review__card-head"><span>DELIVER TO</span><a>Change</a></div>
        <div class="m-review__name">{{ checkout.shippingAddress().firstName }} {{ checkout.shippingAddress().lastName }}</div>
        <div class="m-review__addr">{{ checkout.shippingAddress().address1 }}, {{ checkout.shippingAddress().city }} - {{ checkout.shippingAddress().zip }}</div>
      </div>

      <div class="m-review__card">
        <div class="m-review__card-head"><span>PAYMENT METHOD</span><a>Change</a></div>
        <div class="m-review__name">💳 {{ paymentLabel() }}</div>
      </div>

      <div class="m-review__items-label">ORDER ITEMS ({{ cart.items().length }})</div>
      @for (item of cart.items(); track item.product.id) {
        <div class="m-review__item">
          <img [src]="item.product.image" [alt]="item.product.title" />
          <div class="m-review__item-info">
            <div class="m-review__item-mfr">{{ item.product.manufacturer }}</div>
            <div class="m-review__item-pn">{{ item.product.manufacturerPartNumber }}</div>
            <div class="m-review__item-qty">Qty: {{ item.qty }}</div>
          </div>
          <div class="m-review__item-price">{{ formatPrice(item.product.price * item.qty) }}</div>
        </div>
      }

      <div class="m-review__totals">
        <div class="m-review__totals-row"><span>Subtotal</span><span>{{ formatPrice(cart.subtotal()) }}</span></div>
        <div class="m-review__totals-row"><span>Shipping</span><span class="m-review__free">FREE</span></div>
        <div class="m-review__totals-row"><span>Est. Tax (18% GST)</span><span>{{ formatPrice(cart.tax()) }}</span></div>
        <div class="m-review__totals-row m-review__totals-row--total"><span>Total Amount</span><span>{{ formatPrice(cart.total()) }}</span></div>
      </div>
    </div>
    <div class="m-review__footer">
      <button class="m-review__place" (click)="placeOrder()">Place Order — {{ formatPrice(cart.total()) }}</button>
      <div class="m-review__ssl">🔒 SSL Encrypted Secure Payment</div>
    </div>
  `,
  styles: [`
    .m-review { background: #f5f5f7; min-height: calc(100vh - 220px); padding: 16px; }
    .m-review__card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
    .m-review__card-head { display: flex; justify-content: space-between; font-size: 12px; color: #888; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 8px; }
    .m-review__card-head a { color: var(--color-primary, #70284e); font-weight: 700; }
    .m-review__name { font-size: 16px; font-weight: 800; color: #1a1a2e; }
    .m-review__addr { font-size: 13.5px; color: #666; margin-top: 4px; }
    .m-review__items-label { font-size: 12px; font-weight: 800; color: #888; letter-spacing: 0.5px; margin: 18px 0 10px; }
    .m-review__item { background: #fff; border-radius: 10px; padding: 12px; display: flex; gap: 12px; margin-bottom: 10px; align-items: center; }
    .m-review__item img { width: 52px; height: 52px; object-fit: contain; border: 1px solid #eee; border-radius: 8px; padding: 4px; }
    .m-review__item-info { flex: 1; }
    .m-review__item-mfr { font-size: 11.5px; color: #888; }
    .m-review__item-pn { font-size: 14.5px; font-weight: 800; color: var(--color-primary, #70284e); }
    .m-review__item-qty { font-size: 12px; color: #666; }
    .m-review__item-price { font-weight: 800; font-size: 14.5px; color: #1a1a2e; }
    .m-review__totals { background: #fff; border-radius: 12px; padding: 16px; margin-top: 8px; }
    .m-review__totals-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; padding: 6px 0; }
    .m-review__free { color: #1f8a4c; font-weight: 700; }
    .m-review__totals-row--total { font-weight: 800; font-size: 18px; color: #1a1a2e; border-top: 1px solid #eee; margin-top: 6px; padding-top: 12px; }
    .m-review__footer { padding: 14px 16px 18px; background: #fff; border-top: 1px solid #eee; }
    .m-review__place { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 15px; font-weight: 700; font-size: 15px; }
    .m-review__ssl { text-align: center; font-size: 12px; color: #888; margin-top: 10px; }
  `]
})
export class MobileCheckoutReview {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  orderService = inject(OrderService);
  auth = inject(AuthService);
  router = inject(Router);

  paymentLabel(): string {
    return PAYMENT_LABELS[this.checkout.paymentMethod()] ?? 'Card';
  }

  placeOrder() {
    const email = this.auth.currentUser()?.email ?? 'guest@example.com';
    const order = this.orderService.placeOrder({
      userEmail: email,
      items: this.cart.items(),
      subtotal: this.cart.subtotal(),
      tax: this.cart.tax(),
      total: this.cart.total(),
      shippingAddress: this.checkout.shippingAddress(),
      billingAddress: this.checkout.shippingAddress(),
      billingSameAsShipping: true,
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
