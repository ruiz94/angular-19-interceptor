import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = process.env['BASE_URL'] || 'http://localhost:4000';

  http = inject(HttpClient);
  router = inject(Router);

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');

    if(!refreshToken){
      this.logOut();
      return throwError( () => new Error('No refresh token found'));
    }

    return this.http.post<{ refreshToken: string }>(`${this.baseUrl}/token`, { refreshToken })
    .pipe(
      map( response => response.refreshToken ),
      tap( ( newAccessToken: string) => {
        localStorage.setItem('token', newAccessToken);
      }),
      catchError( error => {
        this.logOut();
        return throwError(() => error);
      })
    )

  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }

  constructor() { }
}
