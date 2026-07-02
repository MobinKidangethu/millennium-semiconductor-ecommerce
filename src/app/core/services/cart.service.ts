import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  items = this._items.asReadonly();

  lastAdded = signal<{ product: Product; qty: number } | null>(null);

  itemCount = computed(() => this._items().reduce((s, i) => s + i.qty, 0));

  subtotal = computed(() =>
    this._items().reduce((s, i) => s + i.product.price * i.qty, 0)
  );

  tax = computed(() => +(this.subtotal() * 0.18).toFixed(2));

  total = computed(() => +(this.subtotal() + this.tax()).toFixed(2));

  add(product: Product, qty = 1) {
    this._items.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...items, { product, qty }];
    });
    this.lastAdded.set({ product, qty });
  }

  updateQty(productId: number, qty: number) {
    if (qty < 1) { this.remove(productId); return; }
    this._items.update(items =>
      items.map(i => i.product.id === productId ? { ...i, qty } : i)
    );
  }

  remove(productId: number) {
    this._items.update(items => items.filter(i => i.product.id !== productId));
  }

  clear() { this._items.set([]); }
}