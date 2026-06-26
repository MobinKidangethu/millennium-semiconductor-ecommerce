import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer, CheckoutStepper],
  templateUrl: './payment.html',
  styleUrls: ['./payment.scss']
})
export class Payment {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  private router = inject(Router);

  activePayment = signal('credit');
  sameAsShipping = signal(true);

  paymentMethods = [
    { id: 'credit', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'wire', label: 'Wire Transfer', icon: '🏦' },
    { id: 'net30', label: 'Net 30 (Account Required)', icon: '📄' },
    { id: 'po', label: 'Purchase Order', icon: '📋' }
  ];

  reviewOrder() {
    this.checkout.paymentMethod.set(this.activePayment());
    this.router.navigate(['/checkout/review']);
  }
}