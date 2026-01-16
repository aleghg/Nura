import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class CarritoComponent {

  cart$!: Observable<CartItem[]>;

  constructor(public cart: CartService) {
    this.cart$ = this.cart.cart$;
  }

  eliminar(id: number): void {
    this.cart.remove(id);
  }

  vaciar(): void {
    this.cart.clear();
  }

  total(): number {
    return this.cart.total();
  }
}
