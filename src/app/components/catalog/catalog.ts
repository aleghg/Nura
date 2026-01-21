import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { CategoriaService} from '../../services/categoria.service';
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
  categoriaId!: number;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    // Captura el ID de categoría desde la URL
    this.route.paramMap.subscribe(params => {
      this.categoriaId = Number(params.get('id'));
      this.cargarProductos();
    });

    // Cargar listado de categorías para menú
    this.categoriaService.getAll().subscribe({
      next: cats => this.categorias = cats,
      error: err => console.error('Error cargando categorías', err)
    });
  }

  cargarProductos(): void {
    this.productoService.getByCategoria(this.categoriaId).subscribe({
      next: prod => this.productos = prod,
      error: err => console.error('Error cargando productos', err)
    });
  }

  agregarAlCarrito(idProducto: number): void {
    this.carritoService.agregarProducto(idProducto).subscribe({
      next: () => alert('Producto agregado al carrito'),
      error: err => console.error('Error agregando al carrito', err)
    });
  }
}