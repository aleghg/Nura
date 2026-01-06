import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {

  // 🔹 DATOS DEL BACKEND
  products: any[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  // 🔥 PASO 7.1 — CARGAR DATOS
  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
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