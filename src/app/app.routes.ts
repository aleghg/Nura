import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

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

      // 🔐 LOGIN / REGISTER (PÚBLICO)
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login')
            .then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register')
            .then(m => m.RegisterComponent)
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

      // 👤 USUARIOS (SOLO ADMIN)
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./components/usuarios/usuarios')
            .then(m => m.UsuariosComponent)
      }
    ]
  },

  /* =============================
     🟢 LAYOUT SHOP (PROTEGIDO)
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
          import('./components/shop/shop')
            .then(m => m.ShopComponent)
      }
    ]
  },

  
{
  path: 'carrito',
  loadComponent: () =>
    import('./components/carrito/carrito')
      .then(m => m.CarritoComponent)
},

// 💻 PERFIL DEL USUARIO (PRIVADO)
{
   path: 'perfil',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./components/perfil/perfil').then(m => m.PerfilComponent)
},

  /* =============================
     ❌ FALLBACK
  ============================== */
  {
    path: '**',
    redirectTo: ''
  }
];
