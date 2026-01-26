import { Component, OnInit, AfterViewInit } from '@angular/core';  
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Services
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { CartService } from '../../services/cart.service';

// Models
import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';

// Componentes
import { ShopHeaderComponent } from '../../shared/ui/header/shop-header';
import Swal from 'sweetalert2';

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
  cargando = true;

  // 🔴 Mensajes de error
  errorCategorias: string = '';
  errorProductos: string = '';

  categoriaId: number | null = null;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router 
  ) {}

  ngOnInit(): void {
    console.log('🔥 Shop cargado');

    this.cargarCategorias();
    
    
    // ✅ ESCUCHAR CAMBIO DE URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.categoriaId = id ? Number(id) : null;
      console.log('➡️ Cambio de ruta categoría:', this.categoriaId);
      this.cargarProductos();
    });

    // ✅ DATOS DEL RESOLVER (SE MANTIENE, PERO YA NO PISA)
    this.route.data.subscribe(data => {
      if (data['categorias']) {
        this.categorias = data['categorias'].filter((c: Categoria) => c.activo);
      }

      if (data['productos'] && this.productos.length === 0) {
        this.productos = data['productos'].filter((p: Producto) => p.activo);
        this.productosFiltrados = this.normalizar(this.productos);
        this.cargando = false;
      }
    });

    setTimeout(() => {
      console.log('🧪 Producto real:', this.productos[0]);
    }, 1000);
  }

  // =========================
  // 📂 Categorías
  // =========================
  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data.filter(c => c.activo);
        console.log('📂 Categorías:', this.categorias);
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.errorCategorias = err.error?.mensaje || 'Error cargando categorías';
      }
    });
  }

  // =========================
  // 📦 Productos
  // =========================
  cargarProductos(): void {
    this.cargando = true;

    if (this.categoriaId) {
      this.productoService.getByCategoria(this.categoriaId).subscribe({
        next: (data: Producto[]) => {
          console.log('📦 Productos por categoría:', data);
          this.productos = data.filter(p => p.activo);
          this.productosFiltrados = this.normalizar(this.productos);
          this.cargando = false;
          return;
        },
        error: (err) => {
          console.error('Error cargando productos por categoría', err);
          this.errorProductos = err.error?.mensaje || 'Error cargando productos';
          this.cargando = false;
        }
      });
      return;
    }

    // 🔁 comportamiento original (todos)
    this.productoService.getAll().subscribe({
      next: (data: Producto[]) => {
        console.log('📦 Productos cargados:', data);
        this.productos = data.filter(p => p.activo);
        this.productosFiltrados = this.normalizar(this.productos);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.errorProductos = err.error?.mensaje || 'Error cargando productos';
        this.cargando = false;
      }
    });
  }

  // =========================
  // 🔎 Filtro por categoría 
  // =========================
  filtrarPorCategoria(categoria: Categoria | null): void {
    console.log('👉 Click categoría:', categoria);

    if (!categoria) {
      this.router.navigate(['/shop']); 
      return;
    }

    this.router.navigate(['/shop/categoria', categoria.idCategoria]);
  }

  // =========================
  // 🔍 Buscador (🔥 YA FUNCIONA)
  // =========================
  buscarProducto(): void {
    console.log('🔍 Buscando:', this.busqueda);

    const texto = this.busqueda.toLowerCase().trim();

    if (!texto) {
      this.productosFiltrados = this.normalizar(this.productos);
      return;
    }

    this.productosFiltrados = this.normalizar(
      this.productos.filter(p =>
        JSON.stringify(p).toLowerCase().includes(texto)
      )
    );

    console.log('📦 Resultado:', this.productosFiltrados.length);
  }

  // =========================
  // 🖼 Imagen Base64
  // =========================
  getImagen(producto: Producto): string {
    return producto.imagenBase64
      ? 'data:image/png;base64,' + producto.imagenBase64.replace(/\s/g, '')
      : 'assets/no-image.png';
  }

  // =========================
  // 🛒 Carrito
  // =========================
  agregarAlCarrito(producto: Producto): void {
    this.cartService.agregarProducto(producto.idProducto, 1).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Agregado! 🛒',
          text: `${producto.nombre} se agregó al carrito`,
          icon: 'success',
          timer: 1200,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Error agregando al carrito:', err);
        Swal.fire({
          title: 'Error',
          text: err.error?.mensaje || 'No se pudo agregar el producto al carrito',
          icon: 'error',
          confirmButtonColor: '#C6A97E'
        });
      }
    });
  }

  // =========================
  // 👉 Click → detalle
  // =========================
  irADetalle(producto: Producto) {
  this.router.navigate(['/shop/producto', producto.idProducto]);
}

  // =========================
  // ✨ Animaciones
  // =========================
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

  // =========================
  // 🔧 Utilidad
  // =========================
  private normalizar(prod: Producto[]): Producto[] {
    return prod.map(p => ({
      ...p,
      imagenBase64: p.imagenBase64?.replace(/\s/g, '')
    }));
  }

  trackById(index: number, item: Producto) {
    return item.idProducto;
  }
}
