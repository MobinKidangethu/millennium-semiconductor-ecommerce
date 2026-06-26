import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then(m => m.Cart) },
  { path: 'checkout/shipping', loadComponent: () => import('./pages/shipping/shipping').then(m => m.Shipping) },
  { path: 'checkout/payment', loadComponent: () => import('./pages/payment/payment').then(m => m.Payment) },
  { path: 'checkout/review', loadComponent: () => import('./pages/review/review').then(m => m.Review) },
  { path: 'checkout/confirmation', loadComponent: () => import('./pages/confirmation/confirmation').then(m => m.Confirmation) },
  { path: '**', redirectTo: '' }
];