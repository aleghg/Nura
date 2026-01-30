import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopHeaderComponent } from '../../../shared/ui/header/shop-header';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-pago-pendiente',
  standalone: true,
  imports: [CommonModule, ShopHeaderComponent, RouterModule],
  template: `
    <app-shop-header></app-shop-header>
    <div class="text-center py-32">
      <h1 class="text-4xl mb-6 text-yellow-600">⏳ Pago pendiente</h1>
      <p>Estamos procesando tu pago. Te notificaremos.</p>
      <button routerLink="/perfil" class="mt-8">Ver pedidos</button>
    </div>
  `
})
export class PagoPendienteComponent {}
