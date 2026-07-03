import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../shared/interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  login(
    email: string,
    password: string
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      {
        email,
        password
      }
    );
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem(
      'accessToken',
      response.accessToken
    );

    localStorage.setItem(
      'refreshToken',
      response.refreshToken
    );

    localStorage.setItem(
      'user',
      JSON.stringify(response.usuario)
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(
      'accessToken'
    );
  }

  getUser(): any {
    const user = localStorage.getItem(
      'user'
    );

    return user
      ? JSON.parse(user)
      : null;
  }

  logout(): void {
    localStorage.removeItem(
      'accessToken'
    );

    localStorage.removeItem(
      'refreshToken'
    );

    localStorage.removeItem(
      'user'
    );
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  updateAccessToken(
    accessToken: string
  ): void {
    localStorage.setItem(
      'accessToken',
      accessToken
    );
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(
      'refreshToken'
    );
  }

  refreshAccessToken() {
    return this.http.post(
      `${this.apiUrl}/auth/refresh`,
      {
        refreshToken: this.getRefreshToken()
      }
    );
  }
}