import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './environments/environment';

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  branchId: string | null;
  username:string |null
  branchName: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<UserProfile | null>(null);
  private _token = '';

  constructor(private http: HttpClient, private router: Router) {
    this.loadSession();
  }

  get user() {
    return this._user();
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string; user: UserProfile }>(`${environment.apiBaseUrl}/auth/login`, { username, password }).subscribe({
      next: (resp) => {
        this._token = resp.token;
        this._user.set(resp.user);
        this.saveSession();
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.error('Invalid credentials');
        alert(error.error.error)
        
      }
    });
  }

  logout() {
    this._token = '';
    this._user.set(null);
    this.clearSession();
    this.router.navigateByUrl('/login');
  }

  private saveSession() {
    localStorage.setItem('user', JSON.stringify(this.user));
    localStorage.setItem('token', this._token);
  }

  private loadSession() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      this._user.set(JSON.parse(user));
      this._token = token;
    }
  }

  
  private clearSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}
