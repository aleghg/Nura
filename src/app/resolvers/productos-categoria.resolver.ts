import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../models/producto.model';

export const productosCategoriaResolver: ResolveFn<Producto[]> = (route: ActivatedRouteSnapshot) => {
  const service = inject(ProductoService);
  const id = Number(route.paramMap.get('id'));
  return service.getByCategoria(id);
};
