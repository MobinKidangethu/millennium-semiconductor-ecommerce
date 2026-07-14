import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { Products } from '../../pages/products/products';
import { MobileProducts } from '../products/mobile-products';

@Component({
  standalone: true,
  imports: [Products, MobileProducts],
  template: `@if (vp.isMobile()) { <app-mobile-products /> } @else { <app-products /> }`
})
export class ResponsiveProducts {
  vp = inject(ViewportService);
}
