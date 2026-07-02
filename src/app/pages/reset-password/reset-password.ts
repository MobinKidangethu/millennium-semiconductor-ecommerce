import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer],
  templateUrl: './reset-password.html'
})
export class ResetPassword implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  password = signal('');
  confirmPassword = signal('');
  error = signal('');
  submitting = signal(false);
  success = signal(false);

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.error.set('This password reset link is missing a token. Please request a new one.');
    }
  }

  submit() {
    this.error.set('');
    if (!this.password() || this.password().length < 6) {
      this.error.set('Password must be at least 6 characters.');
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      return;
    }
    this.submitting.set(true);
    setTimeout(() => {
      const result = this.auth.resetPassword(this.token, this.password());
      this.submitting.set(false);
      if (result.success) {
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } else {
        this.error.set(result.error ?? 'Unable to reset password.');
      }
    }, 400);
  }
}
