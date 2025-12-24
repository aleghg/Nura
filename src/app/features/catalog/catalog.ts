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
      nombre: 'Vestido Aurora',
      precio: 120,
      imagen: 'https://images.unsplash.com/photo-1520974735194-6c9a5f15c3b4'
    },
    {
      nombre: 'Blusa Lúmina',
      precio: 80,
      imagen: 'https://images.unsplash.com/photo-1520975916090-3105956dac38'
    },
    {
      nombre: 'Abrigo Éter',
      precio: 210,
      imagen: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b'
    },
    {
      nombre: 'Pantalón Aura',
      precio: 95,
      imagen: 'https://images.unsplash.com/photo-1520975434754-9a34f56c2f8c'
    }
  ];
}
