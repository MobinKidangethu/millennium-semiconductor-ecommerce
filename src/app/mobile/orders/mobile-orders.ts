import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';
import { inr } from '../../core/utils/price.utils';
import { MobileBackHeader } from '../shell/mobile-back-header';

type Tab = 'Active' | 'Completed' | 'Cancelled';

@Component({
  selector: 'app-mobile-orders',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe, MobileBackHeader],
  template: `
    <app-mobile-back-header title="My Orders"></app-mobile-back-header>
    <div class="m-orders">
      <div class="m-orders__tabs">
        @for (t of tabs; track t) {
          <button class="m-orders__tab" [class.active]="tab() === t" (click)="tab.set(t)">{{ t }}</button>
        }
      </div>

      @if (filteredOrders().length === 0) {
        <p class="m-orders__empty">No {{ tab().toLowerCase() }} orders.</p>
      }

      @for (order of filteredOrders(); track order.orderNumber) {
        <div class="m-orders__card">
          <div class="m-orders__card-top">
            <strong>Order #{{ order.orderNumber }}</strong>
            <span>{{ order.placedAt | date:'MMM d, y' }}</span>
          </div>
          @for (item of order.items; track item.product.id) {
            <div class="m-orders__item">
              <img [src]="item.product.image" [alt]="item.product.title" />
              <div>
                <div class="m-orders__item-pn">{{ item.product.manufacturerPartNumber }}</div>
                <div class="m-orders__item-desc">{{ item.product.title }}</div>
                <div class="m-orders__item-price">{{ formatPrice(item.product.price * item.qty) }}</div>
              </div>
            </div>
          }
          <div class="m-orders__card-bottom">
            <span class="m-orders__status" [class]="statusClass(order.status)">{{ statusLabel(order.status) }}</span>
            <a [routerLink]="['/m/orders', order.orderNumber]">View Details</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .m-orders { background: #f5f5f7; min-height: calc(100vh - 60px); padding: 16px; }
    .m-orders__tabs { display: flex; gap: 10px; margin-bottom: 16px; }
    .m-orders__tab { flex: 1; padding: 11px; border-radius: 999px; border: 1px solid #ddd; background: #fff; font-weight: 700; font-size: 13.5px; color: #555; }
    .m-orders__tab.active { background: var(--color-primary, #70284e); color: #fff; border-color: transparent; }
    .m-orders__empty { text-align: center; color: #888; padding: 40px 0; }
    .m-orders__card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 14px; }
    .m-orders__card-top { display: flex; justify-content: space-between; font-size: 13.5px; color: #333; padding-bottom: 12px; border-bottom: 1px solid #f2f2f2; margin-bottom: 12px; }
    .m-orders__card-top span { color: #999; }
    .m-orders__item { display: flex; gap: 12px; margin-bottom: 10px; }
    .m-orders__item img { width: 56px; height: 56px; object-fit: contain; border: 1px solid #eee; border-radius: 8px; padding: 4px; }
    .m-orders__item-pn { font-weight: 800; color: var(--color-primary, #70284e); font-size: 14px; }
    .m-orders__item-desc { font-size: 12.5px; color: #666; margin: 2px 0; }
    .m-orders__item-price { font-weight: 700; font-size: 13.5px; color: #1a1a2e; }
    .m-orders__card-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #f2f2f2; }
    .m-orders__status { font-size: 11.5px; font-weight: 800; padding: 5px 10px; border-radius: 5px; }
    .m-orders__status--delivered { background: #e3f6ea; color: #1f8a4c; }
    .m-orders__status--transit { background: #fdf3d8; color: #b8860b; }
    .m-orders__status--processing { background: #f0e5ec; color: var(--color-primary, #70284e); }
    .m-orders__card-bottom a { color: var(--color-primary, #70284e); font-weight: 700; font-size: 13.5px; text-decoration: none; }
  `]
})
export class MobileOrders implements OnInit {
  private auth = inject(AuthService);
  private orderService = inject(OrderService);

  tabs: Tab[] = ['Active', 'Completed', 'Cancelled'];
  tab = signal<Tab>('Active');
  orders = signal<Order[]>([]);

  filteredOrders = computed(() => {
    const all = this.orders();
    if (this.tab() === 'Completed') return all.filter(o => o.status === 'Delivered');
    if (this.tab() === 'Cancelled') return [];
    return all.filter(o => o.status !== 'Delivered');
  });

  ngOnInit() {
    const email = this.auth.currentUser()?.email;
    if (email) this.orders.set(this.orderService.getOrdersForUser(email));
  }

  statusLabel(status: string): string {
    if (status === 'Delivered') return 'DELIVERED TODAY';
    if (status === 'Out for Delivery' || status === 'Shipped') return 'IN TRANSIT';
    return 'PROCESSING';
  }

  statusClass(status: string): string {
    if (status === 'Delivered') return 'm-orders__status--delivered';
    if (status === 'Out for Delivery' || status === 'Shipped') return 'm-orders__status--transit';
    return 'm-orders__status--processing';
  }

  formatPrice(p: number): string {
    return inr(p);
  }
}
