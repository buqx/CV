import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(environment.tmdbBaseUrl)) {
    const modifiedReq = req.clone({
      params: req.params.set('api_key', environment.tmdbApiKey)
    });

    return next(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error.status, error.statusText, error.url);
        return throwError(() => error);
      })
    );
  }

  return next(req);
};