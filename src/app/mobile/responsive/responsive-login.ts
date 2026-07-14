import { Component, inject } from '@angular/core';
import { ViewportService } from '../../core/services/viewport.service';
import { Login } from '../../pages/login/login';
import { MobileLogin } from '../login/mobile-login';

@Component({
  standalone: true,
  imports: [Login, MobileLogin],
  template: `@if (vp.isMobile()) { <app-mobile-login /> } @else { <app-login /> }`
})
export class ResponsiveLogin {
  vp = inject(ViewportService);
}
