import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';

@Component({
  selector: 'app-department-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-master.component.html',
  styleUrls: ['./department-master.component.scss']
})
export class DepartmentMasterComponent implements OnInit {
  departments: any;
  filteredDepartments: any;
  paginatedDepartments: any;
  department = { id: 0, name: '' };
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.adminService.getDepartments().subscribe(data => {
      this.departments = data;
      this.onSearch();
    });
  }

  onSearch(): void {
    this.filteredDepartments = this.searchService.filterData(this.departments, this.searchTerm);
    this.totalPages = this.paginationService.getTotalPages(this.filteredDepartments, this.pageSize);
    this.updatePaginatedDepartments();
  }

  updatePaginatedDepartments(): void {
    this.paginatedDepartments = this.paginationService.getPaginatedData(this.filteredDepartments, this.currentPage, this.pageSize);
  }

  goToPage(event: Event, page: number): void {
    event.preventDefault();
    this.currentPage = page;
    this.updatePaginatedDepartments();
  }

  saveDepartment() {
    if (this.department.id) {
      this.adminService.updateDepartment(this.department.id, this.department).subscribe(() => {
        this.loadDepartments();
      });
    } else {
      this.adminService.addDepartment(this.department).subscribe(() => {
        this.loadDepartments();
      });
    }
    this.department = { id: 0, name: '' };
  }

  editDepartment(department: any) {
    this.department = { ...department };
  }

  deleteDepartment(id: number) {
    this.adminService.deleteDepartment(id).subscribe(() => {
      this.loadDepartments();
    });
  }
}
