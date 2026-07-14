import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { Orders } from '../../pages/orders/orders';
import { MobileOrders } from '../orders/mobile-orders';

@Component({
  standalone: true,
  imports: [Orders, MobileOrders],
  template: `@if (vp.isMobile()) { <app-mobile-orders /> } @else { <app-orders /> }`
})
export class ResponsiveOrders {
  vp = inject(ViewportService);
}
