import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MobileAuthHeader } from '../shell/mobile-auth-header';

@Component({
  selector: 'app-mobile-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, MobileAuthHeader],
  template: `
    <app-mobile-auth-header variant="back"></app-mobile-auth-header>
    <div class="m-auth">
      <h1 class="m-auth__title">Create Account</h1>
      <p class="m-auth__sub">Please enter your details to create account</p>

      @if (error()) { <div class="m-auth__error">{{ error() }}</div> }

      <label class="m-auth__label">Full Name</label>
      <input class="m-auth__input" [(ngModel)]="name" placeholder="John Doe" />

      <label class="m-auth__label">Email Address</label>
      <input class="m-auth__input" type="email" [(ngModel)]="email" placeholder="name@company.com" />

      <label class="m-auth__label">Contact Number</label>
      <div class="m-auth__phone-row">
        <select class="m-auth__code"><option>+91</option></select>
        <input class="m-auth__input m-auth__phone" [(ngModel)]="phone" placeholder="Enter mobile number" />
      </div>

      <label class="m-auth__label">Password</label>
      <input class="m-auth__input" type="password" [(ngModel)]="password" placeholder="Create a password" />

      <label class="m-auth__label">Confirm Password</label>
      <input class="m-auth__input" type="password" [(ngModel)]="confirmPassword" placeholder="Confirm your password" />

      <button class="m-auth__submit" (click)="submit()" [disabled]="submitting()">{{ submitting() ? 'Creating…' : 'Create Account' }}</button>

      <p class="m-auth__switch">Already have an account? <a routerLink="/m/login">Sign In</a></p>

      <div class="m-auth__divider"><span>OR</span></div>
      <p class="m-auth__switch-through">Sign In or Create Account through</p>

      <button class="m-auth__social">📧 Create with Google</button>
    </div>
  `,
  styles: [`
    .m-auth { background: #fff; padding: 28px 20px 40px; min-height: calc(100vh - 60px); }
    .m-auth__title { font-size: 28px; font-weight: 800; color: #1a1a2e; text-align: center; margin: 8px 0 4px; }
    .m-auth__sub { text-align: center; color: #888; font-size: 14.5px; margin-bottom: 24px; }
    .m-auth__error { background: #fde8e8; color: #c0392b; padding: 10px 14px; border-radius: 8px; font-size: 13.5px; margin-bottom: 16px; }
    .m-auth__label { display: block; font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
    .m-auth__input { width: 100%; box-sizing: border-box; border: 1px solid #ddd; background: #f7f7f9; border-radius: 8px; padding: 14px; font-size: 15px; margin-bottom: 18px; }
    .m-auth__phone-row { display: flex; gap: 10px; }
    .m-auth__code { border: 1px solid #ddd; background: #f7f7f9; border-radius: 8px; padding: 0 10px; margin-bottom: 18px; }
    .m-auth__phone { flex: 1; }
    .m-auth__submit { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 15px; font-weight: 700; font-size: 16px; }
    .m-auth__switch { text-align: center; font-size: 14px; color: #666; margin: 18px 0; }
    .m-auth__switch a { color: var(--color-primary, #70284e); font-weight: 700; text-decoration: none; }
    .m-auth__divider { text-align: center; position: relative; margin: 18px 0; border-top: 1px solid #eee; }
    .m-auth__divider span { position: relative; top: -11px; background: #fff; padding: 0 12px; color: #999; font-size: 13px; }
    .m-auth__switch-through { text-align: center; font-weight: 700; color: #1a1a2e; font-size: 14.5px; margin-bottom: 16px; }
    .m-auth__social { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 14px; margin-bottom: 12px; font-weight: 600; font-size: 14.5px; background: #fff; text-align: left; }
  `]
})
export class MobileRegister {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  error = signal('');
  submitting = signal(false);

  submit() {
    this.error.set('');
    if (!this.name || !this.email || !this.password) {
      this.error.set('Please fill in all required fields.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }
    this.submitting.set(true);
    setTimeout(() => {
      const result = this.auth.register(this.name.trim(), this.email.trim(), this.password);
      this.submitting.set(false);
      if (result.success) this.router.navigate(['/m/account']);
      else this.error.set(result.error ?? 'Unable to create account.');
    }, 400);
  }
}
