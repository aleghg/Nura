import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CarritoDetalle } from '../../services/cart.service';
import { PaymentService } from '../../services/pago.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ShopHeaderComponent } from '../../shared/ui/header/shop-header';
import { SafeImagePipe } from '../../pipes/safe-image-pipe';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model'; 

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ShopHeaderComponent, SafeImagePipe],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {

  items$: Observable<CarritoDetalle[]>;
  total$: Observable<number>;

  usuario!: Usuario;

  direccionEnvio = '';
  metodoPago = 'tarjeta';
  cedula = '';
  telefono = '';
  codigoDescuento = '';

  envio = 8000;
  descuento = 0;

  estadoPago: 'idle' | 'procesando' | 'exitoso' | 'fallido' | 'pendiente' = 'idle';

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private UsuarioService: UsuarioService
  ) {
    this.items$ = this.cartService.carrito$;

    this.total$ = this.items$.pipe(
      map(items =>
        items.reduce((acc, item) =>
          acc + item.producto.precio * item.cantidad, 0)
      )
    );
  }

  ngOnInit(): void {

  const data = this.route.snapshot.data?.['data'];

  if (data?.usuario) {
    this.usuario = data.usuario;
    this.cedula = this.usuario.cedula || '';
    this.telefono = this.usuario.telefono || '';
  } else {
    // 🔥 Fallback si no viene del resolver
    this.UsuarioService.me().subscribe({
      next: user => {
        this.usuario = user;
        this.cedula = user.cedula || '';
        this.telefono = user.telefono || '';
      },
      error: err => {
        console.error('Error cargando usuario', err);
      }
    });
  }
}


  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/no-image.png';
  }

  aplicarDescuento() {
    if (this.codigoDescuento === 'DESCUENTO10') {
      this.descuento = 0.1;
    } else {
      alert('Código inválido');
    }
  }

  pagar() {
    if (!this.direccionEnvio.trim()) {
      alert('Por favor ingresa la dirección de envío');
      return;
    }

    this.estadoPago = 'procesando';

    const dto = {
      direccionEnvio: this.direccionEnvio,
      metodoPago: this.metodoPago,
      cedula: this.cedula,
      telefono: this.telefono,
      descuentoCodigo: this.codigoDescuento
    };

    this.http.post(`${environment.apiUrl}/pedidos/crear`, dto, {
      
    }).subscribe({
      next: (pedido: any) => {
        this.items$.subscribe(items => {
          this.paymentService.crearPreferencia(items).subscribe({
            next: (response: any) => {
              localStorage.setItem('ultimoPedidoId', pedido.idPedido);
              window.location.href = response.init_point;
            },
            error: err => {
              this.estadoPago = 'fallido';
              alert('Error al generar el pago');
            }
          });
        });
      },
      error: err => {
        this.estadoPago = 'fallido';
        alert('Error al confirmar el pedido');
      }
    });
  }
}
