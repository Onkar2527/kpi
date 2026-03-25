import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';
import { PeriodService } from 'src/app/core/period.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-branch-staff-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-staff-list.component.html',
  styleUrls: ['./branch-staff-list.component.scss'],
})
export class BranchStaffListComponent implements OnInit {

  UserData: any[] = [];
  filteredUsers: any[] = [];
  paginatedUsers: any[] = [];

  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  period: any;
  visiblePages: number[] = [];

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService,
    private periodService: PeriodService
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
      this.loadUsers();
    });
  }

  loadUsers() {
    this.adminService.getUsers().subscribe((data: any) => {

      const filteredSortedData = data
        .filter((item: any) =>
          (item.role === 'BM' ||
           item.role === 'Clerk' ||
           item.role === 'Attender') &&
           item.branch_id != null
        )
        .sort((a: any, b: any) => a.branch_id - b.branch_id);

      this.UserData = filteredSortedData;
      this.onSearch();
    });
  }

  onSearch(): void {
    this.currentPage = 1; 

    this.filteredUsers = this.searchService.filterData(
      this.UserData,
      this.searchTerm
    );

    this.totalPages = this.paginationService.getTotalPages(
      this.filteredUsers,
      this.pageSize
    );

    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    this.paginatedUsers = this.paginationService.getPaginatedData(
      this.filteredUsers,
      this.currentPage,
      this.pageSize
    );

    this.updateVisiblePages();
  }

  goToPage(event: Event, page: number): void {
    event.preventDefault();

    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  updateVisiblePages(): void {
    const pagesPerGroup = 10;

    const startPage =
      Math.floor((this.currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;

    const endPage = Math.min(startPage + pagesPerGroup - 1, this.totalPages);

    this.visiblePages = [];

    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  
  exportToExcel(): void {

    const data = this.filteredUsers.map((user: any) => ({
      'PF NO': user.PF_NO,
      'Name': user.name,
      'Designation': user.role,
      'Branch Code': user.branch_id,
      'Branch Name': user.branch_name
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

   
    worksheet['!cols'] = [
      { wch: 10 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 }
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Users': worksheet },
      SheetNames: ['Users']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    this.saveAsExcelFile(excelBuffer, 'Branch_Staff_List');
  }

 
  saveAsExcelFile(buffer: any, fileName: string): void {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);

    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().slice(0,10)}.xlsx`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

}