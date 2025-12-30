import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  
})
export class ProductDetail {

  producto!: Producto;

  productos: Producto[] = [
    {
      id: 0,
      nombre: 'Vestido Luzéa',
      precio: 120000,
      imagen: 'https://images.unsplash.com/photo-1520974735194-6c9a5f15c3b4',
      descripcion: 'Vestido de satén fluido con tirantes finos y caída delicada que realza la silueta con elegancia natural. Ideal para ocasiones especiales o noches sofisticadas.'
    },
    {
      id: 1,
      nombre: 'Blusa Clair',
      precio: 80000,
      imagen: 'https://images.unsplash.com/photo-1520975916090-3105956dac38',
      descripcion: 'Blusa cruzada de tejido suave con lazada lateral que aporta feminidad y estructura. Una pieza versátil que eleva cualquier look con sutileza.'
    },
    {
      id: 2,
      nombre: 'Blazer Atelier',
      precio: 210000,
      imagen: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
      descripcion: 'Blazer de líneas limpias con cinturón ajustable que define la figura con refinamiento. Diseño atemporal pensado para un estilo elegante y moderno.'
    },
    {
      id: 3,
      nombre: 'Vestido Dalia',
      precio: 210000,
      imagen: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
      descripcion: 'Vestido de encaje delicado con textura floral y acabado romántico. Una prenda ligera y femenina que transmite sofisticación y suavidad.'
    },
    {
      id: 4,
      nombre: 'Top Solea',
      precio: 95000,
      imagen: 'https://images.unsplash.com/photo-1520975434754-9a34f56c2f8c',
      descripcion: 'Top de punto fino con escote bardot que deja los hombros al descubierto de forma sutil. Aporta sensualidad discreta y comodidad al vestir.'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const found = this.productos.find(p => p.id === id);

    if (found) {
      this.producto = found;
    }
  }

  add(): void {
    this.cartService.add(this.producto);
  }
}