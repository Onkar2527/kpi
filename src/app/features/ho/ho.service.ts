import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HoService {

  constructor(private http: HttpClient) { }

  uploadTargets(period: string, file: File) {
    const formData = new FormData();
    formData.append('period', period);
    formData.append('targetFile', file);
    return this.http.post(`${environment.apiBaseUrl}/targets/upload`, formData);
  }
  uploadTargets1(period: string, file: File) {
    const formData = new FormData();
    formData.append('period', period);
    formData.append('targetFile', file);
    return this.http.post(`${environment.apiBaseUrl}/targets/upload1`, formData);
  }

  uploadBranchSpecificTargets(period: string, file: File) {
    const formData = new FormData();
    formData.append('period', period);
    formData.append('targetFile', file);
    return this.http.post(`${environment.apiBaseUrl}/targets/upload-branch-specific`, formData);
  }

  uploadInsuranceTargetsGlobal(period: string, csvData: string) {
    return this.http.post(`${environment.apiBaseUrl}/targets/upload-insurance-global`, { period, csvData });
  }

  uploadPreviousYearData(period: string, file: File) {
    const formData = new FormData();
    formData.append('period', period);
    formData.append('prevoiustargetFile', file);
    return this.http.post(`${environment.apiBaseUrl}/targets/previousData`, formData);
  }
   uploadTotalAchievedData(period: string, file: File) {
    const formData = new FormData();
    formData.append('period', period);
    formData.append('totalAchievedFile', file);
    return this.http.post(`${environment.apiBaseUrl}/targets/totalAchieved`, formData);
  }
   uploadSalary(period: string, file: File) {
    const formData = new FormData();
    formData.append('period', period);
    formData.append('salaryFile', file);
    return this.http.post(`${environment.apiBaseUrl}/targets/uploadSalary`, formData);
  }
}
