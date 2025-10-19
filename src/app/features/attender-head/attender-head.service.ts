import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttenderHeadService {
  private apiUrl = `${environment.apiBaseUrl}/masters/users`;

  constructor(private http: HttpClient) { }

  getAttendersByBranch(branchId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/branch/${branchId}/role/attender`);
  }
}
