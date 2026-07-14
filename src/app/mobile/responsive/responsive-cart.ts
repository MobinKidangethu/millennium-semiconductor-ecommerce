import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { Cart } from '../../pages/cart/cart';
import { MobileCart } from '../cart/mobile-cart';

@Component({
  standalone: true,
  imports: [Cart, MobileCart],
  template: `@if (vp.isMobile()) { <app-mobile-cart /> } @else { <app-cart /> }`
})
export class ResponsiveCart {
  vp = inject(ViewportService);
}
