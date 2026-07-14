import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { Register } from '../../pages/register/register';
import { MobileRegister } from '../register/mobile-register';

@Component({
  standalone: true,
  imports: [Register, MobileRegister],
  template: `@if (vp.isMobile()) { <app-mobile-register /> } @else { <app-register /> }`
})
export class ResponsiveRegister {
  vp = inject(ViewportService);
}
