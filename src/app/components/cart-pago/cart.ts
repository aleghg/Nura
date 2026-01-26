import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ShopHeaderComponent } from '../../shared/ui/header/shop-header';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ShopHeaderComponent],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {

  items: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.carrito$.subscribe(items => {
      console.log('🛒 Cart page recibió:', items);
      this.items = items;
    });
  }

  eliminar(idProducto: number) {
    this.cartService.removerProducto(idProducto);
  }

  total(): number {
    return this.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  pagar() {
    this.router.navigate(['/shop/checkout']);
  }
}
