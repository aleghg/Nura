import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeImage',
  standalone: true  
})
export class SafeImagePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) {
      return '/assets/no-image.png';  // Fallback directo si no hay imagen
    }
    if (value.startsWith('data:image')) {
      return value;  // Ya es un data URI válido
    }
    // Asumimos PNG; cambia a 'jpeg' si tus imágenes son JPG
    return 'data:image/png;base64,' + value;
  }
}