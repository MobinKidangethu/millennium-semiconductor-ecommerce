import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { ProductDetail } from '../../pages/product-detail/product-detail';
import { MobileProductDetail } from '../product-detail/mobile-product-detail';

@Component({
  standalone: true,
  imports: [ProductDetail, MobileProductDetail],
  template: `@if (vp.isMobile()) { <app-mobile-product-detail /> } @else { <app-product-detail /> }`
})
export class ResponsiveProductDetail {
  vp = inject(ViewportService);
}
