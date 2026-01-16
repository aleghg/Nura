import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CartComponent } from "../../../features/cart/cart";
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; // 🔹 IMPORTANTE PARA *ngIf y *ngFor

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,    // 🔹 Necesario para *ngIf
    RouterModule,
    RouterLink,
    CartComponent
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'] // 🔹 Asegúrate que sea styleUrls, no styleUrl
})
export class HeaderComponent {

  isScrolled = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // 🔹 Determina si el usuario está autenticado
  get isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  // 🔹 Abrir login
  openLogin() {
    this.router.navigate(['/login']);
  }

  // 🔹 Cerrar sesión
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
