import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {

  producto: any;

  productos = [
    {
      nombre: 'Vestido Aurora',
      precio: 120,
      imagen: 'https://images.unsplash.com/photo-1520974735194-6c9a5f15c3b4',
      descripcion: 'Elegancia fluida con cortes atemporales.'
    },
    {
      nombre: 'Blusa Lúmina',
      precio: 80,
      imagen: 'https://images.unsplash.com/photo-1520975916090-3105956dac38',
      descripcion: 'Ligereza y sofisticación para cada día.'
    },
    {
      nombre: 'Abrigo Éter',
      precio: 210,
      imagen: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
      descripcion: 'Diseño estructurado con carácter moderno.'
    },
    {
      nombre: 'Pantalón Aura',
      precio: 95,
      imagen: 'https://images.unsplash.com/photo-1520975434754-9a34f56c2f8c',
      descripcion: 'Comodidad elevada a elegancia.'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.producto = this.productos[id];
  }

  add(): void {
    this.cartService.add(this.producto);
  }
}
