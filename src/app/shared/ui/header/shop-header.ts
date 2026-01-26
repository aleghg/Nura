import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-shop-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-header.html',
  styleUrls: ['./shop-header.css']
})
export class ShopHeaderComponent implements OnInit {


  // Variables para dropdown del carrito
  carritoCantidad: number = 0;
  cartItems: CartItem[] = [];
  totalCarrito: number = 0;
  dropdownOpen: boolean = false;
  animarCarrito: boolean = false;

  usuario$!: Observable<{ email: string; rol: string } | null>;

  constructor(
    public auth: AuthService,
    private cartService: CartService,
    private router: Router 
  ) {
    
    // Inicializar observable dentro del constructor
    this.usuario$ = this.auth.usuario$;}

  ngOnInit(): void {
    // Suscribirse a cambios del carrito desde el servicio
    this.cartService.carrito$.subscribe(items => {
    console.log('🛒 Header recibió carrito:', items);
    this.cartItems = items;
    this.carritoCantidad = items.reduce((sum, i) => sum + i.cantidad, 0);
    this.totalCarrito = items.reduce((sum, i) => sum + i.cantidad * i.precio, 0);

      // Animación al agregar item
      if (items.length) {
        this.animarCarrito = true;
        setTimeout(() => this.animarCarrito = false, 300);
      }
    });
  }

  removerItem(idProducto: number): void {
  this.cartService.removerProducto(idProducto);
}

  openLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  irAlCarrito() {
    this.router.navigate(['/shop/carrito']);
  }
}
