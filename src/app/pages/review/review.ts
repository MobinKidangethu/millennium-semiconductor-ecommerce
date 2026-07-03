import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';
import { BackorderBadge } from '../../shared/backorder-badge/backorder-badge';
import { inr } from '../../core/utils/price.utils';
import { paymentMethodLabel } from '../../core/utils/payment.utils';

type PaymentStep = 'idle' | 'gateway' | 'otp' | 'upi-waiting' | 'verifying' | 'success';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer, CheckoutStepper, BackorderBadge],
  templateUrl: './review.html',
  styleUrls: ['./review.scss']
})
export class Review {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  private router = inject(Router);

  paymentStep = signal<PaymentStep>('idle');
  otpDigits = signal<string[]>(['', '', '', '', '', '']);
  otpError = signal(false);

  get addr() { return this.checkout.shippingAddress(); }

  get billingAddr() {
    return this.checkout.billingSameAsShipping()
      ? this.checkout.shippingAddress()
      : (this.checkout.billingAddress() ?? this.checkout.shippingAddress());
  }

  paymentLabel(id: string): string {
    return paymentMethodLabel(id);
  }

  get otpValue(): string {
    return this.otpDigits().join('');
  }

  get otpComplete(): boolean {
    return this.otpValue.length === 6;
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/[^0-9]/g, '').slice(-1);
    input.value = val;
    this.otpDigits.update(d => {
      const next = [...d];
      next[index] = val;
      return next;
    });
    this.otpError.set(false);
    if (val && input.nextElementSibling instanceof HTMLInputElement) {
      input.nextElementSibling.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && input.previousElementSibling instanceof HTMLInputElement) {
      input.previousElementSibling.focus();
    }
  }

  placeOrder() {
    const method = this.checkout.paymentMethod();
    if (method === 'credit') {
      this.paymentStep.set('gateway');
      setTimeout(() => this.paymentStep.set('otp'), 1300);
    } else if (method === 'upi') {
      this.paymentStep.set('upi-waiting');
      setTimeout(() => {
        this.paymentStep.set('success');
        setTimeout(() => this.finalizeOrder(), 1300);
      }, 2800);
    } else {
      this.finalizeOrder();
    }
  }

  submitOtp() {
    if (!this.otpComplete) {
      this.otpError.set(true);
      return;
    }
    this.paymentStep.set('verifying');
    setTimeout(() => {
      this.paymentStep.set('success');
      setTimeout(() => this.finalizeOrder(), 1300);
    }, 1300);
  }

  cancelPayment() {
    this.paymentStep.set('idle');
    this.otpDigits.set(['', '', '', '', '', '']);
    this.otpError.set(false);
  }

  private finalizeOrder() {
    this.paymentStep.set('idle');
    this.router.navigate(['/checkout/confirmation']);
  }

  formatINR(amount: number): string { return inr(amount); }
}
