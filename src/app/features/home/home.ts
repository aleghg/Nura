import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { ProductoService } from '../../services/producto.service';

// Componentes
import { HeaderComponent } from '../../shared/ui/header/header';

// Models (opcional, si quieres tipar tus productos)
import { Producto } from '../../models/producto.model';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']  // 🔹 corregido de styleUrl → styleUrls
})
export class Home implements OnInit, AfterViewInit {

  // 🔹 DATOS DEL BACKEND
  products: Producto[] = [];  // 🔹 mejor tipado
  loading: boolean = true;

  constructor(private productoService: ProductoService) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    this.cargarProductosDestacados();
  }

  // =========================
  // CARGAR PRODUCTOS DESTACADOS
  // =========================
  cargarProductosDestacados(): void {
    this.productoService.getFeaturedProducts().subscribe({
      next: (data: Producto[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando productos', err);
        this.loading = false;
      }
    });
  }

  // =========================
  // ANIMACIONES REVEAL
  // =========================
  ngAfterViewInit(): void {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible', 'reveal-active');
            observer.unobserve(entry.target); // opcional: se observa solo una vez
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));
  }

}
