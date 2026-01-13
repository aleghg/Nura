import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [

  // 🌿 HOME PÚBLICO (marca, info general)
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home')
        .then(m => m.Home)
  },
  // 🔐 AUTH (PÚBLICO)
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

  // 🧪 RUTA DE PRUEBA POST-LOGIN (FASE 1 y 2)
  {
    path: 'protected',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./protected/protected')
        .then(m => m.Protected)
  },
  // 🟢 SHOP (FASE 3)
  {
    path: 'shop',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/shop/shop')
        .then(m => m.Shop)
  },

  // 🛒 CART (PRIVADO)
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cart/cart')
        .then(m => m.CartComponent)
  },

  // 💳 CHECKOUT (PRIVADO)
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout')
        .then(m => m.CheckoutComponent)
  },

  // 🛍️ CATÁLOGO PÚBLICO (OPCIONAL)
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

  // ❌ FALLBACK
  {
    path: '**',
    redirectTo: ''
  },

];
