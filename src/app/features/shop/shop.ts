
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { ShopHeaderComponent } from '../../shared/ui/header/shop-header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, ShopHeaderComponent],
  styleUrl: './shop.css',
  templateUrl: './shop.html'
})


export class ShopComponent implements OnInit, AfterViewInit {

  // 🔹 categorías
  categorias: string[] = ['Todos'];

  // 🔹 productos
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  /* =========================
     INIT
  ========================= */

  ngOnInit(): void {
    this.cargarProductos();
  }

  /* =========================
     REVEAL EDITORIAL
  ========================= */

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

    document
      .querySelectorAll('.reveal')
      .forEach(el => observer.observe(el));
  }

  /* =========================
     CARGAR PRODUCTOS
  ========================= */

  cargarProductos(): void {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;

        // Categorías dinámicas
        const categoriasUnicas = new Set(
          data.map(p => `Categoría ${p.idCategoria}`)
        );

        this.categorias = ['Todos', ...categoriasUnicas];
      },
      error: (err) => {
        console.error('Error cargando productos', err);
      }
    });
  }

  /* =========================
     FILTRAR POR CATEGORÍA
  ========================= */

  filtrarPorCategoria(categoria: string): void {
    if (categoria === 'Todos') {
      this.productosFiltrados = this.productos;
      return;
    }

    this.productosFiltrados = this.productos.filter(
      p => `Categoría ${p.idCategoria}` === categoria
    );
  }

  /* =========================
     BUSCAR
  ========================= */

  buscarProducto(event: Event): void {
    const texto = (event.target as HTMLInputElement).value.toLowerCase();

    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
  }

  /* =========================
     IMAGEN BASE64
  ========================= */

  getImagen(producto: Producto): string {
    return producto.imagen
      ? 'data:image/png;base64,' + producto.imagen
      : 'assets/no-image.png';
  }
}

