import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [RouterLink, Header, Footer, CheckoutStepper],
  templateUrl: './review.html',
  styleUrls: ['./review.scss']
})
export class Review {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  private router = inject(Router);

  placeOrder() {
    this.router.navigate(['/checkout/confirmation']);
  }

  get addr() { return this.checkout.shippingAddress(); }
  get method() { return this.checkout.shippingMethod(); }
}