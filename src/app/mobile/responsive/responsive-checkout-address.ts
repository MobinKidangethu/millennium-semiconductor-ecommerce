import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { Shipping } from '../../pages/shipping/shipping';
import { MobileCheckoutAddress } from '../checkout-address/mobile-checkout-address';

@Component({
  standalone: true,
  imports: [Shipping, MobileCheckoutAddress],
  template: `@if (vp.isMobile()) { <app-mobile-checkout-address /> } @else { <app-shipping /> }`
})
export class ResponsiveCheckoutAddress {
  vp = inject(ViewportService);
}
