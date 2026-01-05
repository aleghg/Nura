import { Component, AfterViewInit } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {

  ngAfterViewInit(): void {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible','reveal-active');
          }
        });
      }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
  }
}