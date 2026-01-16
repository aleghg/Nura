import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { AuthStateService } from '../../../services/auth-state.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shop-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-header.html',
  styleUrls: ['./shop-header.css']
})
export class ShopHeaderComponent implements OnInit {

  carritoCantidad = 0;
  animarCarrito = false;

  @Output() buscar = new EventEmitter<string>();

  // Variables para dropdown del carrito
  dropdownOpen = false;
  cartItems: any[] = [];
  totalCarrito = 0;

  // Usuario logueado
  usuario: any = null;

  constructor(
    private router: Router,
    private cartService: CartService,
    public auth: AuthStateService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // 🔹 Obtener usuario logueado desde backend
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get(`${environment.apiUrl}/usuarios/me`, { headers })
        .subscribe({
          next: (res) => this.usuario = res,
          error: (err) => console.error('Error al obtener perfil', err)
        });
    }

    // 🛒 Suscripción al carrito
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;

      const nuevaCantidad = items.reduce((total, item) => total + item.cantidad, 0);
      this.totalCarrito = items.reduce((total, item) => total + item.cantidad * item.precio, 0);

      if (nuevaCantidad !== this.carritoCantidad) {
        this.animarCarrito = true;
        setTimeout(() => this.animarCarrito = false, 250);
      }

      this.carritoCantidad = nuevaCantidad;
    });
  }

  buscarProducto(event: Event): void {
    const texto = (event.target as HTMLInputElement).value;
    this.buscar.emit(texto);
  }

  openLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
