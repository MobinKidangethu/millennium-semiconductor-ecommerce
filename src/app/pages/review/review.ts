import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';
import { inr } from '../../core/utils/price.utils';

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

  get addr() { return this.checkout.shippingAddress(); }

  placeOrder() {
    this.router.navigate(['/checkout/confirmation']);
  }

  formatINR(amount: number): string { return inr(amount); }
}
