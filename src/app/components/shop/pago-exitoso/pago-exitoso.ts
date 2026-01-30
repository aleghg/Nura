import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopHeaderComponent } from '../../../shared/ui/header/shop-header';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [CommonModule, ShopHeaderComponent],
  template: `
    <app-shop-header></app-shop-header>
    <div class="text-center py-32">
      <h1 class="text-4xl mb-6 text-green-600">✔ Pago realizado con éxito</h1>
      <p>Tu pedido fue confirmado correctamente.</p>
      <button routerLink="/perfil" class="mt-8">Ver mis pedidos</button>
    </div>
  `
})
export class PagoExitosoComponent {}
