import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [

  /* =============================
   🌿 LAYOUT PRINCIPAL
  ============================== */
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout')
        .then(m => m.MainLayoutComponent),
    children: [

      // 🌿 HOME PÚBLICO
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

      // 🧪 RUTA PROTEGIDA DE PRUEBA
      {
        path: 'protected',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./protected/protected')
            .then(m => m.Protected)
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

      // 🛍️ CATÁLOGO PÚBLICO
      {
        path: 'catalog',
        loadComponent: () =>
          import('./features/catalog/catalog')
            .then(m => m.Catalog)
      },

      // 📦 DETALLE DE PRODUCTO
      {
        path: 'producto/:id',
        loadComponent: () =>
          import('./features/product-detail/product-detail')
            .then(m => m.ProductDetail)
      }
    ]
  },

  /* =============================
   🟢 LAYOUT SHOP (HEADER SHOP)
  ============================== */
  {
    path: 'shop',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/shop-layout/shop-layout')
        .then(m => m.ShopLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/shop/shop')
            .then(m => m.ShopComponent)
      }
    ]
  },

  /* =============================
   ❌ FALLBACK
  ============================== */
  {
    path: '**',
    redirectTo: ''
  }
];
