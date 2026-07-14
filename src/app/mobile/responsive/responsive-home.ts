import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { Home } from '../../pages/home/home';
import { MobileHome } from '../home/mobile-home';

@Component({
  standalone: true,
  imports: [Home, MobileHome],
  template: `@if (vp.isMobile()) { <app-mobile-home /> } @else { <app-home /> }`
})
export class ResponsiveHome {
  vp = inject(ViewportService);
}
