import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3333';
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, { email, password }).pipe(
      tap(res =>{
        localStorage.setItem('token', res.token);
      })
    );
  }

  register(fullName: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, { fullName, email, password }).pipe(
      tap(res =>{
        localStorage.setItem('token', res.token);
      })
    );
  }

  validateToken(): Observable<boolean> {
    return this.http.get<{ valid: boolean }>(`${this.url}/auth/validate`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
  
  logout(): Observable<any> {
    return this.http.post<any>(`${this.url}/logout`, {}).pipe(
      tap(() => localStorage.removeItem('token'))
    );
  }

}
