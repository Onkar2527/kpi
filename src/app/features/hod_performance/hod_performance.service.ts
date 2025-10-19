import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HoPerformanceService {

  constructor(private http: HttpClient) { }

  getScores(period: string, HODId: string, branch_id: string) {
    return this.http.get(`${environment.apiBaseUrl}/summary/ho-staff-scores-all?period=${period}&hod_id=${HODId}&branch_id=${branch_id}`);
  }

  getHoScores(period: string, HODId: string, branch_id: string) {
    return this.http.get(`${environment.apiBaseUrl}/summary/ho-hod-scores?period=${period}&hod_id=${HODId}&branch_id=${branch_id}`);
  }

  getStaffScores(period: string, ho_staff_id: string, branch_id: string) {
    return this.http.get(`${environment.apiBaseUrl}/summary/specfic-hostaff-scores?period=${period}&ho_staff_id=${ho_staff_id}&branch_id=${branch_id}`);
  }
  createHoStaffScores(payload: any) {
    return this.http.post(`${environment.apiBaseUrl}/summary/save-or-update-ho-staff-kpi`, payload);
  }
  
}
