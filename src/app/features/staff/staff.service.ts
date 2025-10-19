import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) { }

  getMyTargets(period: string, employeeId: string, branchId: string) {
    return this.http.get(`${environment.apiBaseUrl}/allocations?period=${period}&employeeId=${employeeId}&branchId=${branchId}`);
  }

  submitNewEntry(entry: any) {
    return this.http.post(`${environment.apiBaseUrl}/entries`, entry);
  }

  getMySubmissions(period: string, employeeId: string) {
    return this.http.get(`${environment.apiBaseUrl}/entries?period=${period}&employeeId=${employeeId}`);
  }
}
