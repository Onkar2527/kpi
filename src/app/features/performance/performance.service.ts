import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  constructor(private http: HttpClient) { }

  getScores(period: string, branchId: string) {
    return this.http.get(`${environment.apiBaseUrl}/summary/staff-scores-all?period=${period}&branchId=${branchId}`);
  }

  getBmScores(period: string, branchId: string) {
    return this.http.get(`${environment.apiBaseUrl}/summary/bm-scores?period=${period}&branchId=${branchId}`);
  }

  getStaffScores(period: string, employeeId: string) {
    return this.http.get(`${environment.apiBaseUrl}/summary/staff-scores?period=${period}&employeeId=${employeeId}`);
  }
}
