import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchManagerService {

  constructor(private http: HttpClient) { }

  getBranchTargets(period: string, branchId: string) {
    return this.http.get(`${environment.apiBaseUrl}/targets?period=${period}&branchId=${branchId}`);
  }

  getAllocations(period: string, branchId: string) {
    return this.http.get(`${environment.apiBaseUrl}/allocations?period=${period}&branchId=${branchId}`);
  }

  autoDistributeTargets(period: string, branchId: string) {
    return this.http.post(`${environment.apiBaseUrl}/allocations/auto-distribute?period=${period}&branchId=${branchId}`, {});
  }
  
autoDistributeTargetsToTransfer(period: string, branchId: string) {
    return this.http.post(`${environment.apiBaseUrl}/allocations/auto-distribute-transfer?period=${period}&branchId=${branchId}`, {});
  }
  publishAllocations(period: string, branchId: string) {
    return this.http.post(`${environment.apiBaseUrl}/allocations/publish`, { period, branchId });
  }

  getEntries(period: string, branchId: string) {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/entries?period=${period}&branchId=${branchId}`);
  }

  verifyEntry(entryId: string) {
    return this.http.post(`${environment.apiBaseUrl}/entries/${entryId}/verify`, {});
  }

  returnEntry(entryId: string) {
    return this.http.post(`${environment.apiBaseUrl}/entries/${entryId}/return`, {});
  }

  getDashboardCounts(period: string, branchId: string) {
    return this.http.get(`${environment.apiBaseUrl}/summary/bm-dashboard-counts?period=${period}&branchId=${branchId}`);
  }
}
