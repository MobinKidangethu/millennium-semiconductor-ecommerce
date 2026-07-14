import { Injectable, signal } from '@angular/core';
import { User } from '../models/auth.model';

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

interface ResetTokenEntry {
  email: string;
  expires: number;
}

const USERS_KEY = 'ms-auth-users';
const SESSION_KEY = 'ms-auth-session';
const RESET_TOKENS_KEY = 'ms-auth-reset-tokens';

// Dummy, client-only auth for demo purposes — no real backend or email delivery.
@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(this.loadSession());

  login(email: string, password: string): { success: boolean; error?: string } {
    const user = this.findUser(email);
    if (!user) return { success: false, error: 'No account found with this email.' };
    if (user.password !== password) return { success: false, error: 'Incorrect password.' };
    this.setSession({ name: user.name, email: user.email });
    return { success: true };
  }

  loginWithGoogle(): User {
    const user: User = { name: 'Gajanan Deo', email: 'gajanan.deo@google.com' };
    const users = this.getUsers();
    if (!users.find(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      users.push({ ...user, password: '' });
      this.saveUsers(users);
    }
    this.setSession(user);
    return user;
  }

  register(name: string, email: string, password: string): { success: boolean; error?: string } {
    if (this.findUser(email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const users = this.getUsers();
    users.push({ name, email, password });
    this.saveUsers(users);
    this.setSession({ name, email });
    return { success: true };
  }

  logout() {
    this.setSession(null);
  }

  updateProfile(update: { name?: string; email?: string; phone?: string }) {
    const current = this.currentUser();
    if (!current) return;
    const next: User = { ...current, ...update };
    this.setSession(next);
  }

  // Simulates sending a password-reset email; returns the token that
  // would normally be delivered via email link.
  requestPasswordReset(email: string): { success: boolean; token?: string; error?: string } {
    const user = this.findUser(email);
    if (!user) return { success: false, error: 'No account found with this email.' };
    const token = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    const tokens = this.getResetTokens();
    tokens[token] = { email: user.email, expires: Date.now() + 1000 * 60 * 30 };
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
    return { success: true, token };
  }

  resetPassword(token: string, newPassword: string): { success: boolean; error?: string } {
    const tokens = this.getResetTokens();
    const entry = tokens[token];
    if (!entry || entry.expires < Date.now()) {
      return { success: false, error: 'This reset link is invalid or has expired.' };
    }
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === entry.email.toLowerCase());
    if (!user) return { success: false, error: 'Account not found.' };
    user.password = newPassword;
    this.saveUsers(users);
    delete tokens[token];
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
    return { success: true };
  }

  private findUser(email: string): StoredUser | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  private getUsers(): StoredUser[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
    const seeded: StoredUser[] = [
      { name: 'Mobin Peter', email: 'mobin@devon.nl', password: 'pass-mobin' },
      { name: 'Shashank Awasthi', email: 'shashank@devon.nl', password: 'pass-shashank' },
      { name: 'Gautam Bhatt', email: 'gautam@devon.nl', password: 'pass-gautam' },
      { name: 'Gajanan Deo', email: 'gajanan@devon.nl', password: 'pass-gajanan' }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
    return seeded;
  }

  private saveUsers(users: StoredUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private getResetTokens(): Record<string, ResetTokenEntry> {
    const raw = localStorage.getItem(RESET_TOKENS_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  private setSession(user: User | null) {
    this.currentUser.set(user);
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }

  private loadSession(): User | null {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
