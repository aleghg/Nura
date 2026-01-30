import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopHeaderComponent } from '../../../shared/ui/header/shop-header';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-pago-fallido',
  standalone: true,
  imports: [CommonModule, ShopHeaderComponent, RouterModule],
  template: `
    <app-shop-header></app-shop-header>
    <div class="text-center py-32">
      <h1 class="text-4xl mb-6 text-red-600">❌ Pago fallido</h1>
      <p>Hubo un problema con tu pago. Inténtalo nuevamente.</p>
      <button routerLink="/checkout" class="mt-8">Reintentar</button>
    </div>
  `
})
export class PagoFallidoComponent {}
