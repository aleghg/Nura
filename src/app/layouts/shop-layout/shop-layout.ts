import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShopHeaderComponent } from '../../shared/ui/header/shop-header';

@Component({
  selector: 'app-shop-layout',
  standalone: true,
  imports: [RouterOutlet, ShopHeaderComponent],
  template: `
    <app-shop-header></app-shop-header>
    <router-outlet></router-outlet>
  `
})
export class ShopLayoutComponent {}
