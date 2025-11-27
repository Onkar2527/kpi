import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';
import { PeriodService } from 'src/app/core/period.service';

@Component({
  selector: 'app-trasfer-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-history.component.html',
  styleUrls: ['./transfer-history.component.scss'],
})
export class TrasferHistoryComponent implements OnInit {
  TranferData: any;
  filteredUsers: any;
  paginatedUsers: any;
  branches: any;
  departments: any;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  period: any;
  history: any;
  selectedEmployee: any;

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
    this.adminService.getTrafterHistory(this.period).subscribe((data: any) => {
      data.sort(
        (a: any, b: any) =>
          new Date(b.transfer_date).getTime() -
          new Date(a.transfer_date).getTime()
      );
      this.TranferData = data;
      this.onSearch();
    });
  }

  onSearch(): void {
    this.filteredUsers = this.searchService.filterData(
      this.TranferData,
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
  
  }

  goToPage(event: Event, page: number): void {
    event.preventDefault();
    this.currentPage = page;
    this.updatePaginatedUsers();
  }


  editUser(user: any) {
    this.selectedEmployee = user;
    console.log(this.selectedEmployee);
      
    this.adminService
      .getTrafterKpiHistory(this.period, user.staff_id)
      .subscribe((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          this.history = data[0];
        } else {
          this.history = null;
        }
        setTimeout(() => {
          const modalEl = document.getElementById('historyModal');
          if (modalEl && (window as any).bootstrap) {
            const modal = new (window as any).bootstrap.Modal(modalEl);
            modal.show();
          }
        }, 0);
      });
  }
  printHistory() {
  const printContents = document.querySelector('#historyModal .modal-body')?.innerHTML;
  const popupWin = window.open('', '_blank', 'width=1000,height=800');

  popupWin!.document.open();
  popupWin!.document.write(`
    <html>
      <head>
        <title>Transfer History - ${this.history?.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h5 { color: #007bff; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #212529; color: white; }
          .table-info { background-color: #e8f4fd; font-weight: bold; }
          .border, .rounded { border-radius: 10px; }
          .shadow-sm { box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body onload="window.print();window.close()">
        <h2>Transfer History - ${this.history?.name}</h2>
        ${printContents}
      </body>
    </html>
  `);
  popupWin!.document.close();
}

}
