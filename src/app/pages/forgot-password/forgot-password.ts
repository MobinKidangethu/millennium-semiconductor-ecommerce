import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {
  private auth = inject(AuthService);

  email = signal('');
  error = signal('');
  submitting = signal(false);
  sent = signal(false);
  resetToken = signal('');

  submit() {
    this.error.set('');
    if (!this.email()) {
      this.error.set('Please enter your email address.');
      return;
    }
    this.submitting.set(true);
    setTimeout(() => {
      const result = this.auth.requestPasswordReset(this.email().trim());
      this.submitting.set(false);
      if (result.success && result.token) {
        this.sent.set(true);
        this.resetToken.set(result.token);
      } else {
        this.error.set(result.error ?? 'Unable to send reset email.');
      }
    }, 400);
  }
}
