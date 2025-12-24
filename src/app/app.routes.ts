import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import {Catalog} from './features/catalog/catalog'
import { ProductDetail } from './features/product-detail/product-detail';
import { Cart } from './features/cart/cart';
import { authGuard } from './auth/auth-guard';
import { Login } from './auth/login/login';
import { Checkout } from './features/checkout/checkout';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'catalog', component: Catalog },
  { path: 'producto/:id', component: ProductDetail },
  { path: 'cart', component: Cart },
  { path: 'login', component: Login },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'checkout', component: Checkout, canActivate: [authGuard] },
];