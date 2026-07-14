import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MobileBackHeader } from '../shell/mobile-back-header';

@Component({
  selector: 'app-mobile-edit-profile',
  standalone: true,
  imports: [FormsModule, MobileBackHeader],
  template: `
    <app-mobile-back-header title="Edit Profile"></app-mobile-back-header>
    <div class="m-edit">
      <div class="m-edit__avatar-wrap">
        <div class="m-edit__avatar">{{ name.charAt(0) || '?' }}</div>
        <button class="m-edit__cam">📷</button>
      </div>

      <label class="m-edit__label">Full Name</label>
      <input class="m-edit__input" [(ngModel)]="name" />

      <label class="m-edit__label">Email Address</label>
      <input class="m-edit__input" [(ngModel)]="email" />

      <label class="m-edit__label">Phone Number</label>
      <input class="m-edit__input" [(ngModel)]="phone" />

      @if (saved()) { <div class="m-edit__saved">Profile updated!</div> }

      <button class="m-edit__save" (click)="save()">Save Changes</button>
    </div>
  `,
  styles: [`
    .m-edit { background: #fff; padding: 24px 20px; min-height: calc(100vh - 60px); }
    .m-edit__avatar-wrap { display: flex; justify-content: center; position: relative; margin-bottom: 28px; }
    .m-edit__avatar { width: 100px; height: 100px; border-radius: 50%; background: var(--color-primary, #70284e); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; }
    .m-edit__cam { position: absolute; bottom: 0; left: 50%; transform: translateX(18px); width: 34px; height: 34px; border-radius: 50%; background: var(--color-primary, #70284e); border: 3px solid #fff; color: #fff; }
    .m-edit__label { display: block; font-size: 13.5px; font-weight: 700; color: #666; margin-bottom: 8px; }
    .m-edit__input { width: 100%; box-sizing: border-box; border: 1px solid #ddd; background: #f7f7f9; border-radius: 8px; padding: 14px; font-size: 15px; margin-bottom: 20px; }
    .m-edit__saved { background: #e6f6ec; color: #1f8a4c; padding: 10px 14px; border-radius: 8px; font-size: 13.5px; margin-bottom: 14px; }
    .m-edit__save { width: 100%; background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 8px; padding: 16px; font-weight: 700; font-size: 15.5px; }
  `]
})
export class MobileEditProfile {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = this.auth.currentUser()?.name ?? '';
  email = this.auth.currentUser()?.email ?? '';
  phone = this.auth.currentUser()?.phone ?? '+91 ';
  saved = signal(false);

  save() {
    this.auth.updateProfile({ name: this.name, email: this.email, phone: this.phone });
    this.saved.set(true);
    setTimeout(() => this.router.navigate(['/m/account']), 700);
  }
}
