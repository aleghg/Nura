import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService} from '../../services/producto.service';
import { HeaderComponent } from '../../shared/ui/header/header'; 
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {

  // 🔹 DATOS DEL BACKEND
  products: any[] = [];
  loading = true;

  constructor(private productService: ProductoService) {}

  // 🔥 PASO 7.1 — CARGAR DATOS
  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (data: any[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando productos', err);
        this.loading = false;
      }
    });
  }

  // 🔥 PASO 7.2 — ANIMACIONES (NO SE TOCA)
  ngAfterViewInit(): void {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible', 'reveal-active');
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));
  }
}