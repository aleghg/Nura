import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto.model';
import { ShopHeaderComponent } from '../../../shared/ui/header/shop-header';

@Component({
  selector: 'app-shop-category',
  standalone: true,
  imports: [CommonModule, RouterModule, ShopHeaderComponent],
  templateUrl: './shop-category.html',
  styleUrls: ['./shop-category.css']
})
export class ShopCategoryComponent implements OnInit {

  categoriaId!: number;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  busqueda = '';
  error = '';
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🔥 ShopCategory activo');

    // ✅ Escuchar cambio de URL
    this.route.paramMap.subscribe(params => {
      this.categoriaId = Number(params.get('id'));
      console.log('➡️ Categoría ID:', this.categoriaId);
      this.cargarProductos();
    });

    // ✅ Resolver (si existe)
    this.route.data.subscribe(data => {
      if (data['productos']) {
        this.productos = data['productos'];
        this.productosFiltrados = this.normalizar(this.productos);
        this.cargando = false;
      }
    });
  }

  cargarProductos(): void {
    this.cargando = true;

    this.productoService.getByCategoria(this.categoriaId).subscribe({
      next: data => {
        console.log('📦 Productos categoría:', data);
        this.productos = data;
        this.productosFiltrados = this.normalizar(data);
        this.cargando = false;
      },
      error: err => {
        console.error('❌ Error cargando productos categoría', err);
        this.error = err.error?.mensaje || 'Error cargando productos';
        this.cargando = false;
      }
    });
  }

  buscarProducto(): void {
    const texto = this.busqueda.toLowerCase().trim();
    this.productosFiltrados = this.normalizar(
      this.productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion?.toLowerCase().includes(texto)
      )
    );
  }

  irADetalle(producto: Producto) {
  console.log('➡️ Navegando a:', producto.idProducto);
  this.router.navigate(['/shop/producto', producto.idProducto]);
}



  getImagen(producto: Producto): string {
    return producto.imagenBase64
      ? 'data:image/png;base64,' + producto.imagenBase64.replace(/\s/g, '')
      : 'assets/no-image.png';
  }

  private normalizar(prod: Producto[]): Producto[] {
    return prod.map(p => ({
      ...p,
      imagenBase64: p.imagenBase64?.replace(/\s/g, '')
    }));
  }
}
