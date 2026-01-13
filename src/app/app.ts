import { Component, signal } from '@angular/core';
import { Router,RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

 showHeader = true;

  constructor(private router: Router) {
    // escucha cada cambio de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // ocultar header solo en /shop y sus subrutas
        this.showHeader = !event.urlAfterRedirects.startsWith('/shop');
      });
  }
}