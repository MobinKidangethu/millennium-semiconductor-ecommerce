import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'products', loadComponent: () => import('./pages/products/products').then(m => m.Products) },
  { path: 'products/:category', loadComponent: () => import('./pages/products/products').then(m => m.Products) },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then(m => m.Cart) },
  { path: 'checkout/shipping', loadComponent: () => import('./pages/shipping/shipping').then(m => m.Shipping) },
  { path: 'checkout/payment', loadComponent: () => import('./pages/payment/payment').then(m => m.Payment) },
  { path: 'checkout/review', loadComponent: () => import('./pages/review/review').then(m => m.Review) },
  { path: 'checkout/confirmation', loadComponent: () => import('./pages/confirmation/confirmation').then(m => m.Confirmation) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPassword) },
  { path: '**', redirectTo: '' }
];
