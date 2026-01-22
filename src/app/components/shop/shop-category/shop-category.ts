import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto.model';
import { ShopHeaderComponent } from '../../../shared/ui/header/shop-header';

@Component({
  selector: 'app-shop-category',
  standalone: true,
  imports: [CommonModule, ShopHeaderComponent],
  templateUrl: './shop-category.html',
  styleUrls: ['./shop-category.css']
})
export class ShopCategoryComponent implements OnInit {

  categoriaId!: number;
  productos: Producto[] = [];
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoriaId = Number(params.get('id'));
      this.cargarProductos();
    });
  }

  cargarProductos(): void {
    this.productoService.getByCategoria(this.categoriaId).subscribe({
      next: data => {
        this.productos = data;
      },
      error: err => {
        this.error = err.error?.mensaje || 'Error cargando productos';
      }
    });
  }

  getImagen(producto: Producto): string {
    return producto.imagenBase64
      ? 'data:image/png;base64,' + producto.imagenBase64.replace(/\s/g, '')
      : 'assets/no-image.png';
  }
}
