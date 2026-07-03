import { Injectable } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';

const ORDERS_KEY = 'ms-orders';
const STATUSES: OrderStatus[] = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

// Dummy, client-only order storage for demo purposes — no real backend.
@Injectable({ providedIn: 'root' })
export class OrderService {
  placeOrder(data: Omit<Order, 'orderNumber' | 'placedAt' | 'status'>): Order {
    const order: Order = {
      ...data,
      orderNumber: this.generateOrderNumber(),
      placedAt: new Date().toISOString(),
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)]
    };
    const orders = this.getAll();
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return order;
  }

  getOrdersForUser(email: string): Order[] {
    return this.getAll()
      .filter(o => o.userEmail.toLowerCase() === email.toLowerCase())
      .sort((a, b) => b.placedAt.localeCompare(a.placedAt));
  }

  getOrder(orderNumber: string): Order | undefined {
    return this.getAll().find(o => o.orderNumber === orderNumber);
  }

  private generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `NXC-${year}-${rand}`;
  }

  private getAll(): Order[] {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}
