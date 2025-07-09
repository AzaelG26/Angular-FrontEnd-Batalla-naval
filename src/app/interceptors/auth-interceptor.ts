import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    const cloned = token? req.clone({
      setHeaders: { Authorization: `Bearer ${token}`}
    }): req;

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) =>{
        if (error.status === 401){
          localStorage.removeItem('token')
          this.router.navigate(['/login'])
        }
        return throwError(() => error);
      })
    );
  }
}
