import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/categoria.model';

export const categoriasResolver: ResolveFn<Categoria[]> = () => {
  const service = inject(CategoriaService);
  return service.getCategorias();
};
