import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './environments/environment';

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  branchId: string | null;
  username: string | null;
  branchName: string | null;
  PF_NO: string | null;
  hod_id: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = signal<UserProfile | null>(null);
  private _token = '';
  private sessionTimeoutId: any;
  errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadSession();
  }

  get user() {
    return this._user();
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }

  login(username: string, password: string,period:string) {
    this.errorMessage.set(null);
    return this.http.post<{ token: string; user: UserProfile }>(`${environment.apiBaseUrl}/auth/login`, { username, password,period }).subscribe({
      next: (resp) => {
        this._token = resp.token;
        this._user.set(resp.user);
        this.saveSession();
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.error('Login error', error);
        if (error.status === 0) {
          this.errorMessage.set('Server is unreachable. Please check your network connection or try again later.');
        } else {
          this.errorMessage.set(error.error?.error || 'Invalid credentials or login failed.');
        }
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
    sessionStorage.setItem('user', JSON.stringify(this.user));
    sessionStorage.setItem('token', this._token);
  }

  private loadSession() {
    const user = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    if (user && token) {
      this._user.set(JSON.parse(user));
      this._token = token;
    }
  }

  private clearSession() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }

  private startClearLocalStorageTimer() {
    this.clearClearLocalStorageTimer(); 
    this.sessionTimeoutId = setTimeout(() => {
      this.clearSession(); 
      console.log('Session storage cleared after 2 minutes');
    }, 2 * 60 * 1000);
  }

  private clearClearLocalStorageTimer() {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = null;
    }
  }
}