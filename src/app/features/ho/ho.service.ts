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

  uploadBranchSpecificTargets(period: string, file: File) {
    const formData = new FormData();
    formData.append('period', period);
    formData.append('targetFile', file);
    return this.http.post(`${environment.apiBaseUrl}/targets/upload-branch-specific`, formData);
  }

  uploadInsuranceTargetsGlobal(period: string, csvData: string) {
    return this.http.post(`${environment.apiBaseUrl}/targets/upload-insurance-global`, { period, csvData });
  }
}
