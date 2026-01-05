import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {

  items$!: Observable<any[]>;

  constructor(private cartService: CartService) {
    this.items$ = this.cartService.items$;
  }

  remove(i: number): void {
    this.cartService.remove(i);
  }
}
