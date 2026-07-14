import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { Review } from '../../pages/review/review';
import { MobileCheckoutReview } from '../checkout-review/mobile-checkout-review';

@Component({
  standalone: true,
  imports: [Review, MobileCheckoutReview],
  template: `@if (vp.isMobile()) { <app-mobile-checkout-review /> } @else { <app-review /> }`
})
export class ResponsiveCheckoutReview {
  vp = inject(ViewportService);
}
