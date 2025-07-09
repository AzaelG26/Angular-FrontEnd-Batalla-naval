import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3333';
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(res =>{
        localStorage.setItem('token', res.token);
      })
    );
  }

  register(fullName: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, { fullName, email, password }).pipe(
      tap(res =>{
        localStorage.setItem('token', res.token);
      })
    );
  }

  validateToken(): Observable<boolean> {
    return this.http.get<{ valid: boolean }>(`${this.baseUrl}/auth/validate`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => localStorage.removeItem('token'))
    );
  }

  validateSession() {
    return this.http.get<{ valid: boolean; user: any }>(`${this.baseUrl}/auth/validate`);
  }

}
