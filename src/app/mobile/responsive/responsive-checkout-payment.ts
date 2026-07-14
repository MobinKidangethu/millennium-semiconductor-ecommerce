import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { Payment } from '../../pages/payment/payment';
import { MobileCheckoutPayment } from '../checkout-payment/mobile-checkout-payment';

@Component({
  standalone: true,
  imports: [Payment, MobileCheckoutPayment],
  template: `@if (vp.isMobile()) { <app-mobile-checkout-payment /> } @else { <app-payment /> }`
})
export class ResponsiveCheckoutPayment {
  vp = inject(ViewportService);
}
