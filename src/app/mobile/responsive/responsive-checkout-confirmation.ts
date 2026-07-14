import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { Confirmation } from '../../pages/confirmation/confirmation';
import { MobileCheckoutConfirmation } from '../checkout-confirmation/mobile-checkout-confirmation';

@Component({
  standalone: true,
  imports: [Confirmation, MobileCheckoutConfirmation],
  template: `@if (vp.isMobile()) { <app-mobile-checkout-confirmation /> } @else { <app-confirmation /> }`
})
export class ResponsiveCheckoutConfirmation {
  vp = inject(ViewportService);
}
