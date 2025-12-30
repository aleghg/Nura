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
    nombre: 'Blazer Atelier',
    precio: 100000,
    imagen: 'products/blazer-crema-cinturon.png',
    descripcion: 'Vestido de satén fluido con tirantes finos y caída delicada que realza la silueta con elegancia natural. Ideal para ocasiones especiales o noches sofisticadas.'
    },
    {
     id: 1,
    nombre: 'Blusa Clair',
    precio: 90000,
    imagen: 'products/blusa-cruzada-lazada.png',
    descripcion: 'Blusa cruzada de tejido suave con lazada lateral que aporta feminidad y estructura. Una pieza versátil que eleva cualquier look con sutileza.'
    },
    {
     id: 2,
    nombre: 'Top Hombros Solea',
    precio: 95000,
    imagen: 'products/top-hombros-punto-fino.png',
      descripcion: 'Blazer de líneas limpias con cinturón ajustable que define la figura con refinamiento. Diseño atemporal pensado para un estilo elegante y moderno.'
    },
    {
      id: 3,
    nombre: 'Vestido Dalia',
    precio: 190000,
    imagen: 'products/vestido-encaje-delicado.png',
    descripcion: 'Vestido de encaje delicado con textura floral y acabado romántico. Una prenda ligera y femenina que transmite sofisticación y suavidad.'
    },
    {
     id: 4,
    nombre: 'Vestido Luzéa',
    precio: 120000,
    imagen: 'products/vestido-satinado-tirantes.png',
      descripcion: 'Top de punto fino con escote bardot que deja los hombros al descubierto de forma sutil. Aporta sensualidad discreta y comodidad al vestir.'
    },
    {
      id: 5,
    nombre: 'Vestido Isara',
    precio: 145000,
    imagen: 'products/vestido-camisero.png',
    descripcion: 'Vestido camisero de silueta fluida con botones frontales. Combina elegancia relajada y funcionalidad moderna.'
    },
    {
      id: 6,
    nombre: 'Conjunto Véline',
    precio: 210000,
    imagen: 'products/conjunto-chaleco.png',
    descripcion: 'Conjunto chaleco de líneas definidas y corte moderno. Perfecto para poner y elevar con un aire contemporáneo.'
    },
    {
      id: 7,
    nombre: 'Abrigo Seren',
    precio: 110000,
    imagen: 'products/abrigo-ligero.png',
    descripcion: 'Abrigo de líneas rectas y estructura suave, pensado para complementar looks sofisticados sin perder ligereza.'
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