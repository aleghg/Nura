import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-shop-header',
  templateUrl: './shop-header.html',
  styleUrls: ['./shop-header.css']
})
export class ShopHeaderComponent {

  // 🎭 DATA FALSA (SOLO DISEÑO)
  totalItems = 3;
  userName = 'Cliente';

  buscar(event: Event): void {
    // SOLO VISUAL
    const value = (event.target as HTMLInputElement).value;
    console.log('Buscando:', value);
  }

}
