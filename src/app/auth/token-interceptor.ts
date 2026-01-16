import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  
  // 🔓 Rutas públicas (NO token)

  const publicEndpoints = [
    '/auth',
    '/productos/featured'
  ];

  // Si la URL es pública → NO agregar Authorization
  if (publicEndpoints.some(url => req.url.includes(url))) {
    return next(req);
  }


  const token = localStorage.getItem('token');

  if (token) {
     const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // ✅ MUY IMPORTANTE
      }
    });
    return next(authReq);
  }

  return next(req);
};