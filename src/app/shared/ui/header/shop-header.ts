import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-shop-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-header.html',
  styleUrls: ['./shop-header.css']
})
export class ShopHeaderComponent implements OnInit {

  carritoCantidad = 0;

  // 🔍 emitir texto de búsqueda al shop
  @Output() buscar = new EventEmitter<string>();

  constructor(
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.carritoCantidad = this.cartService.totalCantidad();

    this.cartService.cart$.subscribe(() => {
      this.carritoCantidad = this.cartService.totalCantidad();
    });
  }

  // 🔎 se ejecuta desde el input del header
  buscarProducto(event: Event): void {
    const texto = (event.target as HTMLInputElement).value;
    this.buscar.emit(texto);
  }

  // 🔐 auth
  get isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  openLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
