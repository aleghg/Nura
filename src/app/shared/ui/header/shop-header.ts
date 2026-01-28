import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CarritoDetalle } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { SafeImagePipe } from '../../../pipes/safe-image-pipe';

@Component({
  selector: 'app-shop-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeImagePipe],
  templateUrl: './shop-header.html',
  styleUrls: ['./shop-header.css']
})
export class ShopHeaderComponent implements OnInit {

  carritoCantidad = 0;
  cartItems: CarritoDetalle[] = [];
  totalCarrito = 0;
  dropdownOpen = false;
  animarCarrito = false;

  usuario$!: Observable<{ email: string; rol: string } | null>;

  constructor(
    public auth: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.usuario$ = this.auth.usuario$;
  }

  ngOnInit(): void {
    this.cartService.carrito$.subscribe(items => {
      console.log('🛒 Header recibió carrito:', items);
      this.cartItems = items;

      this.carritoCantidad = items.reduce((sum, i) => sum + i.cantidad, 0);
      this.totalCarrito = items.reduce(
        (sum, i) => sum + i.producto.precio * i.cantidad,
        0
      );

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

  onImgError(event: Event) {
  (event.target as HTMLImageElement).src = '/assets/no-image.png';
}

}
