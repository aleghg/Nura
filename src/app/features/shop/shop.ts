import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { ShopHeaderComponent } from '../../shared/ui/header/shop-header';


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule,ShopHeaderComponent],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class Shop implements OnInit {

  productos: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.getAll().subscribe({
      next: data => {
        console.log('PRODUCTOS:', data);
        this.productos = data;
      },
      error: err => console.error('ERROR BACKEND:', err)
    });
  }
}