import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';
import { inr } from '../../core/utils/price.utils';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer, CheckoutStepper],
  templateUrl: './shipping.html',
  styleUrls: ['./shipping.scss']
})
export class Shipping {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  private router = inject(Router);

  selectedAddress = signal(0);
  selectedMethod  = signal('standard');
  saveAddress     = signal(false);

  newAddress = signal({
    firstName: '', lastName: '', company: '', address1: '', address2: '',
    city: '', zip: '', state: 'Maharashtra', country: 'India',
    phone: '', po: ''
  });

  continueToPayment() {
    this.checkout.shippingAddress.set(this.checkout.savedAddresses()[this.selectedAddress()]);
    this.checkout.shippingMethod.set(
      this.checkout.shippingMethods.find(m => m.id === this.selectedMethod())!
    );
    this.router.navigate(['/checkout/payment']);
  }

  formatINR(amount: number): string { return inr(amount); }
}
