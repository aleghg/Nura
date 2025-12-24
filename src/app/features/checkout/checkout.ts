import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { PaymentService } from '../../core/services/payment';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html'
})
export class Checkout {

  items$!: Observable<any[]>;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService
  ) {
    this.items$ = this.cartService.items$;
  }

  pagar(): void {
    this.items$.subscribe(items => {
      this.paymentService.crearPreferencia(items)
        .subscribe(response => {
          window.location.href = response.init_point;
        });
    }).unsubscribe();
  }
}
