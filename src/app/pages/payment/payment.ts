import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';
import { AddressForm } from '../../shared/address-form/address-form';
import { Address } from '../../core/models/product.model';
import { inr } from '../../core/utils/price.utils';

const UPI_LIMIT = 100000;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer, CheckoutStepper, AddressForm],
  templateUrl: './payment.html',
  styleUrls: ['./payment.scss']
})
export class Payment {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  auth = inject(AuthService);
  private router = inject(Router);

  activePayment = signal('credit');
  net30Applying = signal(false);

  readonly net30VolumeOptions = [
    'Under ₹1,00,000',
    '₹1,00,000 – ₹5,00,000',
    '₹5,00,000 – ₹20,00,000',
    'Over ₹20,00,000'
  ];

  constructor() {
    if (!this.checkout.cardHolder()) {
      this.checkout.cardHolder.set(this.auth.currentUser()?.name ?? '');
    }
    if (!this.checkout.net30CompanyName()) {
      this.checkout.net30CompanyName.set(this.checkout.shippingAddress().company ?? '');
    }
  }

  readonly upiLimit = UPI_LIMIT;
  upiEligible = computed(() => this.cart.total() <= UPI_LIMIT);

  paymentMethods = [
    { id: 'credit', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'upi',    label: 'UPI Payment',          icon: '📱' },
    { id: 'wire',   label: 'Wire Transfer',        icon: '🏦' },
    { id: 'net30',  label: 'Net 30 (Account Required)', icon: '📄' },
    { id: 'po',     label: 'Purchase Order',        icon: '📋' }
  ];

  get addr() { return this.checkout.shippingAddress(); }

  get billingAddr(): Address {
    return this.checkout.billingSameAsShipping()
      ? this.checkout.shippingAddress()
      : (this.checkout.billingAddress() ?? this.checkout.shippingAddress());
  }

  selectPayment(id: string) {
    if (id === 'upi' && !this.upiEligible()) return;
    this.activePayment.set(id);
  }

  toggleSameAsShipping() {
    this.checkout.billingSameAsShipping.update(v => !v);
  }

  onSaveBillingAddress(event: { address: Address }) {
    this.checkout.billingAddress.set(event.address);
    this.checkout.billingSameAsShipping.set(false);
  }

  // ── Wire transfer ──────────────────────────────────────────────────────
  copyWireDetail(text: string) {
    navigator.clipboard?.writeText(text);
  }

  // ── Net 30 ─────────────────────────────────────────────────────────────
  applyNet30() {
    if (!this.checkout.net30CompanyName() || !this.checkout.net30AuthorizedSigner()) return;
    this.net30Applying.set(true);
    setTimeout(() => {
      this.net30Applying.set(false);
      this.checkout.net30Applied.set(true);
      this.checkout.net30CreditLimit.set(500000);
    }, 1400);
  }

  // ── Purchase Order ────────────────────────────────────────────────────
  onPoFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.checkout.poFileName.set(file ? file.name : '');
  }

  get canContinue(): boolean {
    switch (this.activePayment()) {
      case 'upi': return this.upiEligible();
      case 'wire': return this.checkout.wireAcknowledged();
      case 'net30': return this.checkout.net30Applied();
      case 'po': return !!this.checkout.poNumber() && this.checkout.poAmountConfirmed();
      default: return true;
    }
  }

  reviewOrder() {
    if (!this.canContinue) return;
    this.checkout.paymentMethod.set(this.activePayment());
    this.router.navigate(['/checkout/review']);
  }

  formatINR(amount: number): string { return inr(amount); }
}
