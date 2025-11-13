import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';

@Component({
  selector: 'app-user-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss']
})
export class UserMasterComponent implements OnInit {
  users: any;
  filteredUsers: any;
  paginatedUsers: any;
  user = { id: '', username: '', name: '', password: '',PF_NO:'' ,role: '', branch_id: '', department_id: '' };
  branches: any;
  departments: any;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  visiblePages: number[] = [];

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.adminService.getBranches().subscribe(data => this.branches = data);
    this.adminService.getDepartments().subscribe(data => this.departments = data);
  }

  loadUsers() {
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
      this.onSearch();
    });
  }

  onSearch(): void {
    this.filteredUsers = this.searchService.filterData(this.users, this.searchTerm);
    this.totalPages = this.paginationService.getTotalPages(this.filteredUsers, this.pageSize);
    this.updatePaginatedUsers();
    this.updateVisiblePages();
  }

  updatePaginatedUsers(): void {
    this.paginatedUsers = this.paginationService.getPaginatedData(this.filteredUsers, this.currentPage, this.pageSize);
  }

  goToPage(event: Event, page: number): void {
    event.preventDefault();
    this.currentPage = page;
    this.updatePaginatedUsers();
    this.updateVisiblePages();
  }

  saveUser() {
    if (this.user.id) {
      this.adminService.updateUser(this.user.id, this.user).subscribe(() => {
        this.loadUsers();
      });
    } else {
      this.adminService.addUser(this.user).subscribe(() => {
        this.loadUsers();
      });
    }
    this.user = { id: '', username: '', name: '', password: '', PF_NO:'',role: '', branch_id: '', department_id: '' };
  }

  updateVisiblePages(): void {
    const pagesPerGroup = 10;
    const startPage = Math.floor((this.currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, this.totalPages);

    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }
  editUser(user: any) {
    this.user = { ...user };
  }

  deleteUser(id: string) {
    this.adminService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }
}
