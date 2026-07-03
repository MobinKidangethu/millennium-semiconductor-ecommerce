import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { inr } from '../../core/utils/price.utils';

const STATUS_STAGES: OrderStatus[] = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, DatePipe, Header, Footer],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class Orders implements OnInit {
  auth = inject(AuthService);
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  readonly statusStages = STATUS_STAGES;

  orders = signal<Order[]>([]);
  selectedOrderNumber = signal<string | null>(null);

  constructor() {
    effect(() => {
      const email = this.auth.currentUser()?.email;
      this.orders.set(email ? this.orderService.getOrdersForUser(email) : []);
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selectedOrderNumber.set(params.get('orderNumber'));
    });
  }

  get selectedOrder(): Order | undefined {
    const num = this.selectedOrderNumber();
    return num ? this.orders().find(o => o.orderNumber === num) : undefined;
  }

  statusStageIndex(status: OrderStatus): number {
    return STATUS_STAGES.indexOf(status);
  }

  formatINR(amount: number): string { return inr(amount); }
}
