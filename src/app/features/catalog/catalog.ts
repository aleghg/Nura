import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {

  productos: Producto[] = [
  {
    id: 0,
    nombre: 'Blazer Atelier',
    precio: 100000,
    imagen: 'products/blazer-crema-cinturon.png'
  },
  {
    id: 1,
    nombre: 'Blusa Clair',
    precio: 90000,
    imagen: 'products/blusa-cruzada-lazada.png'
  },
  {
    id: 2,
    nombre: 'Top Hombros Solea',
    precio: 95000,
    imagen: 'products/top-hombros-punto-fino.png'
  },
  {
    id: 3,
    nombre: 'Vestido Dalia',
    precio: 190000,
    imagen: 'products/vestido-encaje-delicado.png'
  },
  {
    id: 4,
    nombre: 'Vestido Luzéa',
    precio: 120000,
    imagen: 'products/vestido-satinado-tirantes.png'
  },
  {
      id: 5,
    nombre: 'Vestido Isara',
    precio: 145000,
    imagen: 'products/vestido-camisero.png'
    },
    {
      id: 6,
    nombre: 'Conjunto Véline',
    precio: 210000,
    imagen: 'products/conjunto-chaleco.png'
    },
    {
      id: 7,
    nombre: 'Abrigo Seren',
    precio: 110000,
    imagen: 'products/abrigo-ligero.png'
    }
];
}