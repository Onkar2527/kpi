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
   getBmTransferScores(period: string, branchId: string) {
    return this.http.get(`${environment.apiBaseUrl}/summary/transfer-bm-scores?period=${period}&branchId=${branchId}`);
  }

  getStaffScores(period: string, employeeId: string,branchId: string) {
    return this.http.get(`${environment.apiBaseUrl}/summary/staff-scores?period=${period}&employeeId=${employeeId}&branchId=${branchId}`);
  }

  submitAuditScore(data:any) {
    return this.http.post(`${environment.apiBaseUrl}/summary/addAudit`,data);
  }
  getSalary(period: string, PF_NO: string){
        return this.http.get(`${environment.apiBaseUrl}/summary/get-salary?period=${period}&PF_NO=${PF_NO}`);
  }
  getAllStaffSalary(period: string, branch_id: string){
        return this.http.get(`${environment.apiBaseUrl}/summary/get-salary-all-staff?period=${period}&branch_id=${branch_id}`);
  }
  getAttenderScores(period: string, branchId: string){
        return this.http.get(`${environment.apiBaseUrl}/summary/branch-attenders?period=${period}&branchId=${branchId}`);
  }
  
}
