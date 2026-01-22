import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { CategoriaService } from '../../services/categoria.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  providers: [DecimalPipe],             
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css']
})

export class Catalog implements OnInit {

  productos: Producto[] = [];
  categorias: any[] = [];
  categoriaId: number | null = null;
  cargando = false;               
  error = ''; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private categoriaService: CategoriaService
  ) {

    console.log('🔥 Catalogo montado');
  }

  ngOnInit(): void {
    console.log('🚀 ngOnInit ejecutado');

    // ✅ Cargar categorías para el menú
    this.categoriaService.getAll().subscribe({
      next: cats => this.categorias = cats,
      error: err => console.error('❌ Error cargando categorías', err)
    });

    // ✅ Escuchar cambios de ruta (/catalog o /categoria/:id)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.categoriaId = id ? Number(id) : null;

      console.log('📍 Ruta detectada → categoría:', this.categoriaId);

      this.cargarProductos();
    });
  }

  // ✅ Se llama desde el menú
  // 🔥 Navegación real (cambia la URL)
  irACategoria(id: number | null): void {
    if (id === null) {
      this.router.navigate(['/catalog']);
    } else {
      this.router.navigate(['/categoria', id]);
    }
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = '';

    console.log('➡️ ID de categoría:', this.categoriaId);

    const request$ = this.categoriaId
      ? this.productoService.getByCategoria(this.categoriaId)
      : this.productoService.getAll(); // 👈 /catalog muestra todos

    request$.subscribe({
      next: prod => {
        console.log('✅ Productos recibidos del backend:', prod);

        // ✅ Normalizamos Base64 por si backend envía saltos de línea
        this.productos = prod.map(p => ({
          ...p,
          imagenBase64: p.imagenBase64?.replace(/\s/g, '')
        }));

        this.cargando = false;
      },
      error: err => {
        console.error('❌ Error cargando productos', err);
        this.error = 'No se pudieron cargar los productos';
        this.cargando = false;
      }
    });
  }

  agregarAlCarrito(idProducto: number): void {
    this.carritoService.agregarProducto(idProducto).subscribe({
      next: () => alert('Producto agregado al carrito'),
      error: err => console.error('Error agregando al carrito', err)
    });
  }
}