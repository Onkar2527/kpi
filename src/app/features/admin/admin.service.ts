import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  // Departments
  getDepartments() {
    return this.http.get(`${environment.apiBaseUrl}/masters/departments`);
  }

  addDepartment(department: any) {
    return this.http.post(`${environment.apiBaseUrl}/masters/departments`, department);
  }

  updateDepartment(id: number, department: any) {
    return this.http.put(`${environment.apiBaseUrl}/masters/departments/${id}`, department);
  }

  deleteDepartment(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/masters/departments/${id}`);
  }

  // Users
  getUsers() {
    return this.http.get(`${environment.apiBaseUrl}/masters/users`);
  }

  addUser(user: any) {
    return this.http.post(`${environment.apiBaseUrl}/masters/users`, user);
  }

  updateUser(id: string, user: any) {
    return this.http.put(`${environment.apiBaseUrl}/masters/users/${id}`, user);
  }

  transferUser(id: string, branch_id:string) {
    return this.http.put(`${environment.apiBaseUrl}/masters/Transfers_user/${id}`, { branch_id });
  }
  deleteUser(id: string) {
    return this.http.delete(`${environment.apiBaseUrl}/masters/users/${id}`);
  }

deleteAllocations(user_id: string) {
  return this.http.delete(
    `${environment.apiBaseUrl}/masters/Transfer_for_delete_allocation`,
    { body: { user_id } } 
  );
}
deleteSpecificHoStaff(ho_staff_id: string, branch_id: string) {
  return this.http.delete(`${environment.apiBaseUrl}/masters/Transfer_for_delete_ho_staff`, { body: { ho_staff_id, branch_id } });
}

  // Branches
  getBranches() {
    return this.http.get(`${environment.apiBaseUrl}/masters/branches`);
  }

  addBranch(branch: any) {
    return this.http.post(`${environment.apiBaseUrl}/masters/branches`, branch);
  }

  updateBranch(id: string, branch: any) {
    return this.http.put(`${environment.apiBaseUrl}/masters/branches/${id}`, branch);
  }

  deleteBranch(id: string) {
    return this.http.delete(`${environment.apiBaseUrl}/masters/branches/${id}`);
  }

  // Weightages
  getWeightages() {
    return this.http.get(`${environment.apiBaseUrl}/masters/weightages`);
  }

  updateWeightage(weightage: any) {
    return this.http.put(`${environment.apiBaseUrl}/masters/weightages`, weightage);
  }

  //transfer
    getTrasferedStaff() {
    return this.http.get(`${environment.apiBaseUrl}/masters/transfers`);
  }

  addTrasferedStaff(branch: any) {
    return this.http.post(`${environment.apiBaseUrl}/masters/transfers`, branch);
  }

  updateTrasferedStaff(id: string, branch: any) {
    return this.http.put(`${environment.apiBaseUrl}/masters/transfers/${id}`, branch);
  }

  deleteTrasferedStaff(id: string) {
    return this.http.delete(`${environment.apiBaseUrl}/masters/transfers/${id}`);
  }
}
