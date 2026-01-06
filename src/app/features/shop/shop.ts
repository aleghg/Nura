import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/ui/header/header';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule,HeaderComponent],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class Shop {}
