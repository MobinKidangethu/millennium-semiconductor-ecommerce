import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { GoogleSigninMock } from '../../shared/google-signin-mock/google-signin-mock';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer, GoogleSigninMock],
  templateUrl: './register.html'
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  agreeTerms = signal(false);
  error = signal('');
  submitting = signal(false);

  submit() {
    this.error.set('');
    if (!this.name() || !this.email() || !this.password()) {
      this.error.set('Please fill in all required fields.');
      return;
    }
    if (this.password().length < 6) {
      this.error.set('Password must be at least 6 characters.');
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      return;
    }
    if (!this.agreeTerms()) {
      this.error.set('Please agree to the Terms of Service to continue.');
      return;
    }

    this.submitting.set(true);
    setTimeout(() => {
      const result = this.auth.register(this.name().trim(), this.email().trim(), this.password());
      this.submitting.set(false);
      if (result.success) {
        this.router.navigate(['/']);
      } else {
        this.error.set(result.error ?? 'Unable to create account.');
      }
    }, 400);
  }

  onGoogleSignIn() {
    this.auth.loginWithGoogle();
    this.router.navigate(['/']);
  }
}
