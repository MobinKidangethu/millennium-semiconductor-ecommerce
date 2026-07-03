import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';
import { AddressForm } from '../../shared/address-form/address-form';
import { Address } from '../../core/models/product.model';
import { inr } from '../../core/utils/price.utils';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer, CheckoutStepper, AddressForm],
  templateUrl: './shipping.html',
  styleUrls: ['./shipping.scss']
})
export class Shipping {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  private router = inject(Router);

  selectedAddress = signal(0);
  selectedMethod  = signal('standard');

  continueToPayment() {
    this.checkout.shippingAddress.set(this.checkout.savedAddresses()[this.selectedAddress()]);
    this.checkout.shippingMethod.set(
      this.checkout.shippingMethods.find(m => m.id === this.selectedMethod())!
    );
    this.router.navigate(['/checkout/payment']);
  }

  onSaveNewAddress(event: { address: Address; setDefault: boolean }) {
    this.checkout.addSavedAddress(event.address, event.setDefault);
    this.selectedAddress.set(this.checkout.savedAddresses().length - 1);
  }

  formatINR(amount: number): string { return inr(amount); }
}
