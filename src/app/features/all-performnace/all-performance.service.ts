import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllPerformanceService {

  constructor(private http: HttpClient) { }

  getScores(period: string, HODId: string, role: string) {
    return this.http.get(`${environment.apiBaseUrl}/performnceMaster/ho-staff-scores-all?period=${period}&hod_id=${HODId}&role=${role}`);
  }

  getHoScores(period: string, HODId: string, role: string) {
    return this.http.get(`${environment.apiBaseUrl}/performnceMaster/ho-Allhod-scores?period=${period}&hod_id=${HODId}&role=${role}`);
  }

  getStaffScores(period: string, ho_staff_id: string, branch_id: string) {
    return this.http.get(`${environment.apiBaseUrl}/summary/specfic-hostaff-scores?period=${period}&ho_staff_id=${ho_staff_id}&branch_id=${branch_id}`);
  }
  createHoStaffScores(payload: any) {
    return this.http.post(`${environment.apiBaseUrl}/summary/save-or-update-ho-staff-kpi`, payload);
  }
  //original for all perfromance
  getAllKpiRoleWise(role:any){
    return this.http.post(`${environment.apiBaseUrl}/performnceMaster/getKpiRoleWise`, role);
  }
   getSpecificALLScores(period: string, ho_staff_id: string, role: string) {
    return this.http.get(`${environment.apiBaseUrl}/performnceMaster/specfic-ALLstaff-scores?period=${period}&ho_staff_id=${ho_staff_id}&role=${role}`);
  }
}
