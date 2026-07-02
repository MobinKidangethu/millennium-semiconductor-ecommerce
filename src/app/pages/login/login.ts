import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { GoogleSigninMock } from '../../shared/google-signin-mock/google-signin-mock';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer, GoogleSigninMock],
  templateUrl: './login.html'
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  rememberMe = signal(true);
  error = signal('');
  submitting = signal(false);

  submit() {
    this.error.set('');
    if (!this.email() || !this.password()) {
      this.error.set('Please enter your email and password.');
      return;
    }
    this.submitting.set(true);
    setTimeout(() => {
      const result = this.auth.login(this.email().trim(), this.password());
      this.submitting.set(false);
      if (result.success) {
        this.router.navigate(['/']);
      } else {
        this.error.set(result.error ?? 'Unable to sign in.');
      }
    }, 400);
  }

  onGoogleSignIn() {
    this.auth.loginWithGoogle();
    this.router.navigate(['/']);
  }
}
