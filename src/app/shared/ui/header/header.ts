import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule  } from '@angular/router';
import { CartComponent  } from "../../../features/cart/cart";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, RouterLink, CartComponent ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {

  isScrolled =false; 

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;

  }
  openLogin() {
    this.router.navigate(['/login']);
  }

}



