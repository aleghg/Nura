import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart';
import { PaymentService } from '../../core/services/payment';
import { Observable, take, map } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html'
})
export class CheckoutComponent {

  items$!: Observable<any[]>;
  total$!: Observable<number>;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService
  ) {
    this.items$ = this.cartService.items$;

    // ✅ EL TOTAL SE CALCULA AQUÍ
    this.total$ = this.items$.pipe(
      map(items =>
        items.reduce((acc, item) => acc + item.precio, 0)
      )
    );
  }

  pagar(): void {
    this.items$
      .pipe(take(1))
      .subscribe(items => {
        this.paymentService
          .crearPreferencia(items)
          .pipe(take(1))
          .subscribe({
            next: response => {
              window.location.href = response.init_point;
            },
            error: err => {
              console.error('Error al crear preferencia de pago', err);
              alert('Ocurrió un error al procesar el pago.');
            }
          });
      });
  }
}
