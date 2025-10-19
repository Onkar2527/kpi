import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KpisService {
  private apiUrl = 'http://localhost:3000/api/kpis';

  constructor(private http: HttpClient) { }

  getKpisForRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles/${role}/kpis`);
  }

  submitEvaluation(evaluation: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/evaluations`, evaluation);
  }

  getEvaluationsForUser(userId: string, period?: string): Observable<any[]> {
    let url = `${this.apiUrl}/users/${userId}/evaluations`;
    if (period) {
      url += `?period=${period}`;
    }
    return this.http.get<any[]>(url);
  }
}
