import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Services
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';

// Models
import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';

// Componentes
import { ShopHeaderComponent } from '../../shared/ui/header/shop-header';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ShopHeaderComponent],
  styleUrls: ['./shop.css'],
  templateUrl: './shop.html'
})
export class ShopComponent implements OnInit, AfterViewInit {

  categorias: Categoria[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  busqueda: string = '';

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data.filter(c => c.activo);
      },
      error: (err) => console.error('Error cargando categorías', err)
    });
  }

  cargarProductos(): void {
    this.productoService.getAll().subscribe({
      next: (data: Producto[]) => {
        this.productos = data.filter(p => p.activo);
        this.productosFiltrados = [...this.productos];
      },
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  filtrarPorCategoria(categoria: Categoria | null): void {
    if (!categoria) {
      this.productosFiltrados = [...this.productos];
      return;
    }

    this.productosFiltrados = this.productos.filter(
      p => p.categoria.idCategoria === categoria.idCategoria
    );
  }

  buscarProducto(): void {
    const texto = this.busqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
  }

  getImagen(producto: Producto): string {
    return producto.imagen
      ? 'data:image/png;base64,' + producto.imagen
      : 'assets/no-image.png';
  }

  agregarAlCarrito(producto: Producto): void {
    // Aquí agregas la lógica de carrito
    console.log('Agregar al carrito:', producto);
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
}
