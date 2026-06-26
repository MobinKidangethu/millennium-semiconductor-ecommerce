import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer, CheckoutStepper],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart {
  cart = inject(CartService);
  couponCode = signal('');
  couponApplied = signal(false);

  updateQty(id: number, qty: number) { this.cart.updateQty(id, qty); }
  remove(id: number) { this.cart.remove(id); }

  applyCoupon() {
    if (this.couponCode().length > 0) this.couponApplied.set(true);
  }

  get shipping(): string { return this.cart.subtotal() > 50 ? 'FREE' : '$18.00'; }
}