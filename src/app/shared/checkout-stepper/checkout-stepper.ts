import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CheckoutStep {
  number: number;
  label: string;
  route: string;
}

@Component({
  selector: 'app-checkout-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-stepper.html',
  styleUrl: './checkout-stepper.scss',
})
export class CheckoutStepper {
  @Input() activeStep = 1;

  steps: CheckoutStep[] = [
    { number: 1, label: 'Cart', route: '/cart' },
    { number: 2, label: 'Shipping', route: '/checkout/shipping' },
    { number: 3, label: 'Payment', route: '/checkout/payment' },
    { number: 4, label: 'Review', route: '/checkout/review' },
    { number: 5, label: 'Confirmation', route: '/checkout/confirmation' }
  ];
}