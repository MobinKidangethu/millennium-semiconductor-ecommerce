import { Routes } from '@angular/router';

export const routes: Routes = [
  // Responsive routes — automatically render the mobile or desktop
  // component depending on viewport width.
  { path: '', loadComponent: () => import('./mobile/responsive/responsive-home').then(m => m.ResponsiveHome) },
  { path: 'products', loadComponent: () => import('./mobile/responsive/responsive-products').then(m => m.ResponsiveProducts) },
  { path: 'products/:category', loadComponent: () => import('./mobile/responsive/responsive-products').then(m => m.ResponsiveProducts) },
  { path: 'product/:id', loadComponent: () => import('./mobile/responsive/responsive-product-detail').then(m => m.ResponsiveProductDetail) },
  { path: 'manufacturer/:name', loadComponent: () => import('./pages/manufacturer-detail/manufacturer-detail').then(m => m.ManufacturerDetail) },
  { path: 'cart', loadComponent: () => import('./mobile/responsive/responsive-cart').then(m => m.ResponsiveCart) },
  { path: 'checkout/shipping', loadComponent: () => import('./mobile/responsive/responsive-checkout-address').then(m => m.ResponsiveCheckoutAddress) },
  { path: 'checkout/payment', loadComponent: () => import('./mobile/responsive/responsive-checkout-payment').then(m => m.ResponsiveCheckoutPayment) },
  { path: 'checkout/review', loadComponent: () => import('./mobile/responsive/responsive-checkout-review').then(m => m.ResponsiveCheckoutReview) },
  { path: 'checkout/confirmation', loadComponent: () => import('./mobile/responsive/responsive-checkout-confirmation').then(m => m.ResponsiveCheckoutConfirmation) },
  { path: 'orders', loadComponent: () => import('./mobile/responsive/responsive-orders').then(m => m.ResponsiveOrders) },
  { path: 'orders/:orderNumber', loadComponent: () => import('./mobile/responsive/responsive-orders').then(m => m.ResponsiveOrders) },
  { path: 'login', loadComponent: () => import('./mobile/responsive/responsive-login').then(m => m.ResponsiveLogin) },
  { path: 'register', loadComponent: () => import('./mobile/responsive/responsive-register').then(m => m.ResponsiveRegister) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPassword) },

  // Direct mobile-only routes — screens that only exist in the mobile
  // experience (no desktop equivalent yet): categories grid, search,
  // account/profile menu, and checkout deep-links used by mobile nav.
  { path: 'm/products', loadComponent: () => import('./mobile/products/mobile-products').then(m => m.MobileProducts) },
  { path: 'm/products/:category', loadComponent: () => import('./mobile/products/mobile-products').then(m => m.MobileProducts) },
  { path: 'm/product/:id', loadComponent: () => import('./mobile/product-detail/mobile-product-detail').then(m => m.MobileProductDetail) },
  { path: 'm/categories', loadComponent: () => import('./mobile/categories/mobile-categories').then(m => m.MobileCategories) },
  { path: 'm/search', loadComponent: () => import('./mobile/search/mobile-search').then(m => m.MobileSearch) },
  { path: 'm/account', loadComponent: () => import('./mobile/account/mobile-account').then(m => m.MobileAccount) },
  { path: 'm/account/edit', loadComponent: () => import('./mobile/edit-profile/mobile-edit-profile').then(m => m.MobileEditProfile) },
  { path: 'm/orders', loadComponent: () => import('./mobile/orders/mobile-orders').then(m => m.MobileOrders) },
  { path: 'm/orders/:orderNumber', loadComponent: () => import('./mobile/orders/mobile-orders').then(m => m.MobileOrders) },
  { path: 'm/login', loadComponent: () => import('./mobile/login/mobile-login').then(m => m.MobileLogin) },
  { path: 'm/register', loadComponent: () => import('./mobile/register/mobile-register').then(m => m.MobileRegister) },
  { path: 'm/checkout/address', loadComponent: () => import('./mobile/checkout-address/mobile-checkout-address').then(m => m.MobileCheckoutAddress) },
  { path: 'm/checkout/payment', loadComponent: () => import('./mobile/checkout-payment/mobile-checkout-payment').then(m => m.MobileCheckoutPayment) },
  { path: 'm/checkout/review', loadComponent: () => import('./mobile/checkout-review/mobile-checkout-review').then(m => m.MobileCheckoutReview) },
  { path: 'm/checkout/confirmation', loadComponent: () => import('./mobile/checkout-confirmation/mobile-checkout-confirmation').then(m => m.MobileCheckoutConfirmation) },

  { path: '**', redirectTo: '' }
];
