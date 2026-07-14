import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MobileAuthHeader } from '../shell/mobile-auth-header';

@Component({
  selector: 'app-mobile-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, MobileAuthHeader],
  template: `
    <app-mobile-auth-header variant="close"></app-mobile-auth-header>
    <div class="m-auth">
      <h1 class="m-auth__title">Welcome back</h1>
      <p class="m-auth__sub">Please enter your details to sign in</p>

      @if (error()) { <div class="m-auth__error">{{ error() }}</div> }

      <label class="m-auth__label">Email Address</label>
      <input class="m-auth__input" type="email" [(ngModel)]="email" placeholder="name@company.com" />

      <label class="m-auth__label">Password</label>
      <div class="m-auth__password-wrap">
        <input class="m-auth__input" [type]="showPw() ? 'text' : 'password'" [(ngModel)]="password" placeholder="Enter password" />
        <button class="m-auth__eye" (click)="showPw.set(!showPw())">👁</button>
      </div>
      <a routerLink="/forgot-password" class="m-auth__forgot">Forgot password?</a>

      <button class="m-auth__submit" (click)="submit()" [disabled]="submitting()">{{ submitting() ? 'Signing in…' : 'Sign In' }}</button>

      <p class="m-auth__switch">Don't have an account? <a routerLink="/m/register">Create Account</a></p>

      <div class="m-auth__divider"><span>OR</span></div>
      <p class="m-auth__switch-through">Sign In or Create Account through</p>

      <button class="m-auth__social">📧 Sign in with Google</button>
      <button class="m-auth__social">in Sign in with LinkedIn</button>
      <button class="m-auth__social">f Sign in with Facebook</button>
    </div>
  `,
  styles: [`
    .m-auth { background: #fff; padding: 28px 20px 40px; min-height: calc(100vh - 60px); }
    .m-auth__title { font-size: 30px; font-weight: 800; color: #1a1a2e; text-align: center; margin: 8px 0 4px; }
    .m-auth__sub { text-align: center; color: #888; font-size: 14.5px; margin-bottom: 24px; }
    .m-auth__error { background: #fde8e8; color: #c0392b; padding: 10px 14px; border-radius: 8px; font-size: 13.5px; margin-bottom: 16px; }
    .m-auth__label { display: block; font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
    .m-auth__input { width: 100%; box-sizing: border-box; border: 1px solid #ddd; background: #f7f7f9; border-radius: 8px; padding: 14px; font-size: 15px; margin-bottom: 18px; }
    .m-auth__password-wrap { position: relative; }
    .m-auth__password-wrap .m-auth__input { padding-right: 44px; }
    .m-auth__eye { position: absolute; right: 12px; top: 14px; background: none; border: none; }
    .m-auth__forgot { display: block; text-align: right; color: var(--color-primary, #70284e); font-size: 13.5px; font-weight: 600; text-decoration: none; margin: -10px 0 20px; }
    .m-auth__submit { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 15px; font-weight: 700; font-size: 16px; }
    .m-auth__switch { text-align: center; font-size: 14px; color: #666; margin: 18px 0; }
    .m-auth__switch a { color: var(--color-primary, #70284e); font-weight: 700; text-decoration: none; }
    .m-auth__divider { text-align: center; position: relative; margin: 18px 0; border-top: 1px solid #eee; }
    .m-auth__divider span { position: relative; top: -11px; background: #fff; padding: 0 12px; color: #999; font-size: 13px; }
    .m-auth__switch-through { text-align: center; font-weight: 700; color: #1a1a2e; font-size: 14.5px; margin-bottom: 16px; }
    .m-auth__social { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 14px; margin-bottom: 12px; font-weight: 600; font-size: 14.5px; background: #fff; text-align: left; }
  `]
})
export class MobileLogin {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPw = signal(false);
  error = signal('');
  submitting = signal(false);

  submit() {
    this.error.set('');
    if (!this.email || !this.password) {
      this.error.set('Please enter your email and password.');
      return;
    }
    this.submitting.set(true);
    setTimeout(() => {
      const result = this.auth.login(this.email.trim(), this.password);
      this.submitting.set(false);
      if (result.success) this.router.navigate(['/m/account']);
      else this.error.set(result.error ?? 'Unable to sign in.');
    }, 400);
  }
}
