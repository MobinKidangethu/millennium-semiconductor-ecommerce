import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [RouterLink, Header, Footer, CheckoutStepper],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.scss']
})
export class Confirmation implements OnInit {
  cart = inject(CartService);
  checkout = inject(CheckoutService);

  // Snapshot items before clearing
  orderItems: any[] = [];
  orderSubtotal = 0;
  orderTax = 0;
  orderTotal = 0;

  ngOnInit() {
    this.orderItems = this.cart.items().map(i => ({ ...i }));
    this.orderSubtotal = this.cart.subtotal();
    this.orderTax = this.cart.tax();
    this.orderTotal = this.cart.total();
    this.cart.clear();
  }

  get addr() { return this.checkout.shippingAddress(); }
  get orderNumber() { return this.checkout.orderNumber(); }
}