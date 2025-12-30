import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {

  productos = [
  {
    nombre: 'Blazer Atelier',
    precio: 100000,
    imagen: 'products/blazer-crema-cinturon.png'
  },
  {
    nombre: 'Blusa Clair',
    precio: 90000,
    imagen: 'products/blusa-cruzada-lazada.png'
  },
  {
    nombre: 'Top Hombros Solea',
    precio: 95000,
    imagen: 'products/top-hombros-punto-fino.png'
  },
  {
    nombre: 'Vestido Dalia',
    precio: 190000,
    imagen: 'products/vestido-encaje-delicado.png'
  },
  {
    nombre: 'Vestido Luzéa',
    precio: 120000,
    imagen: 'products/vestido-satinado-tirantes.png'
  }
];
}