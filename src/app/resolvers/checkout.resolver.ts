import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CartService } from '../services/cart.service';
import { UsuarioService } from '../services/usuario.service';

@Injectable({ providedIn: 'root' })
export class CheckoutResolver implements Resolve<any> {

  constructor(
    private cartService: CartService,
    private UsuarioService: UsuarioService
  ) {}

  resolve() {
    return forkJoin({
      carrito: this.cartService.cargarCarrito(),
      usuario: this.UsuarioService.me()
    });
  }
}
