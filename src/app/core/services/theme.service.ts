import { Injectable, signal, effect } from '@angular/core';

export type ThemeName = 'maroon' | 'blue';

const STORAGE_KEY = 'ms-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<ThemeName>(this.loadInitial());

  constructor() {
    effect(() => {
      const theme = this.theme();
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    });
  }

  setTheme(theme: ThemeName) {
    this.theme.set(theme);
  }

  private loadInitial(): ThemeName {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'blue' ? 'blue' : 'maroon';
  }
}
