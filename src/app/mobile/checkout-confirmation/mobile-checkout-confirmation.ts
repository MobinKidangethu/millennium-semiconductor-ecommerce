import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../core/models/order.model';
import { inr } from '../../core/utils/price.utils';
import { MobileTopBar } from '../shell/mobile-top-bar';

@Component({
  selector: 'app-mobile-checkout-confirmation',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe, MobileTopBar],
  template: `
    <app-mobile-top-bar></app-mobile-top-bar>
    <div class="m-conf">
      <div class="m-conf__check">✓</div>
      <h1 class="m-conf__title">Order Placed<br/>Successfully!</h1>
      @if (order(); as o) {
        <div class="m-conf__number">#{{ o.orderNumber }}</div>
        <p class="m-conf__sub">Your order has been confirmed and is being processed.</p>

        <div class="m-conf__card">
          <div class="m-conf__label">ESTIMATED DELIVERY</div>
          <div class="m-conf__delivery">🚚 {{ estDelivery | date:'EEEE, MMM d, y' }}</div>
          <div class="m-conf__divider"></div>
          <div class="m-conf__label">ORDER SUMMARY</div>
          <div class="m-conf__summary-row">
            <span>{{ o.items.length }} Items • {{ formatPrice(o.total) }}</span>
            <div class="m-conf__thumbs">
              @for (item of o.items.slice(0, 2); track item.product.id) {
                <img [src]="item.product.image" [alt]="item.product.title" />
              }
            </div>
          </div>
        </div>

        <a [routerLink]="['/m/orders', o.orderNumber]" class="m-conf__track">Track Order</a>
        <a routerLink="/m/products" class="m-conf__continue">Continue Shopping ›</a>

        <div class="m-conf__email">✉️ A confirmation email has been sent to <strong>{{ o.userEmail }}</strong></div>
      }
    </div>
  `,
  styles: [`
    .m-conf { background: #fff; min-height: calc(100vh - 60px); padding: 40px 24px; text-align: center; }
    .m-conf__check { width: 90px; height: 90px; border-radius: 50%; background: var(--color-primary, #70284e); color: #fff; font-size: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    .m-conf__title { font-size: 26px; font-weight: 800; color: #1a1a2e; line-height: 1.3; margin: 0 0 10px; }
    .m-conf__number { color: var(--color-primary, #70284e); font-weight: 800; font-size: 16px; margin-bottom: 10px; }
    .m-conf__sub { color: #888; font-size: 14px; margin-bottom: 24px; }
    .m-conf__card { background: #f7f7f9; border-radius: 12px; padding: 18px; text-align: left; margin-bottom: 24px; }
    .m-conf__label { font-size: 11.5px; color: #888; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 8px; }
    .m-conf__delivery { font-weight: 700; font-size: 15px; color: #1a1a2e; }
    .m-conf__divider { height: 1px; background: #e5e5e5; margin: 14px 0; }
    .m-conf__summary-row { display: flex; align-items: center; justify-content: space-between; }
    .m-conf__summary-row span { font-weight: 700; font-size: 14.5px; color: #1a1a2e; }
    .m-conf__thumbs { display: flex; gap: -8px; }
    .m-conf__thumbs img { width: 36px; height: 36px; object-fit: contain; border: 1px solid #ddd; border-radius: 6px; background: #fff; margin-left: -8px; }
    .m-conf__track { display: block; background: var(--color-primary, #70284e); color: #fff; text-decoration: none; padding: 15px; border-radius: 8px; font-weight: 700; margin-bottom: 14px; }
    .m-conf__continue { display: block; color: var(--color-primary, #70284e); text-decoration: none; font-weight: 700; margin-bottom: 24px; }
    .m-conf__email { background: #f7f7f9; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #666; text-align: left; }
  `]
})
export class MobileCheckoutConfirmation implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = signal<Order | null>(null);
  estDelivery = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const num = params['order'];
      if (num) this.order.set(this.orderService.getOrder(num) ?? null);
    });
  }

  formatPrice(p: number): string {
    return inr(p);
  }
}
