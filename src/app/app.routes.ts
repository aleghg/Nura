import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./features/home/home')
        .then(m => m.Home)
  },

  {
    path: 'catalog',
    loadComponent: () =>
      import('./features/catalog/catalog')
        .then(m => m.Catalog)
  },

  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail')
        .then(m => m.ProductDetail)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login')
        .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register')
        .then(m => m.RegisterComponent)
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart')
        .then(m => m.CartComponent),
    canActivate: [authGuard]
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout')
        .then(m => m.CheckoutComponent),
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }

];
