import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../models/producto.model';

export const productosResolver: ResolveFn<Producto[]> = () => {
  const service = inject(ProductoService);
  return service.getAll();
};
