import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';
import { PeriodService } from 'src/app/core/period.service';
import { PerformanceService } from '../../performance/performance.service';
import { AllPerformanceService } from '../../all-performnace/all-performance.service';

@Component({
  selector: 'app-resign-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resign-history.component.html',
  styleUrls: ['./resign-history.component.scss'],
})
export class ResignHistoryComponent implements OnInit {
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
    private periodService: PeriodService,
    private performanceServicestaff: PerformanceService,
        private performanceService:AllPerformanceService
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
      this.loadUsers();
    });
    
  }

  loadUsers() {
    this.adminService.getTrafterHistory(this.period).subscribe((data: any) => {
     data = data
      .filter((item: any) => item.resign == 1)   
      .sort((a: any, b: any) =>
        new Date(b.resign_date).getTime() - new Date(a.resign_date).getTime()
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


    getKpis(transfer: any): string[] {
  if (!transfer) return [];

  return Object.keys(transfer).filter(
    key =>
      key !== 'transfer_date' &&
      key !== 'total_weightage_score' &&
      key !== 'hod_name' &&
      key !== 'old_hod_name' &&
      key !== 'old_branch_name' &&
      key !== 'new_branch_name' &&
      key !== 'old_designation' &&
      key !== 'new_designation'
  );
}


 editUser(user: any) {
  this.selectedEmployee = user;
  if (!user.staff_id) return;

  Promise.all([
    this.adminService.getTrafterKpiHistory(this.period, user.staff_id).toPromise(),
    this.performanceService.getHoStaffHistory(this.period, user.staff_id).toPromise(),
    this.performanceServicestaff.getAttenderTransferScore(this.period, user.staff_id).toPromise()
  ]).then(([emp, ho, att]: any[]) => {

    const empData = emp?.[0] || null;
    const hoData = ho?.[0] || null;
    const attData = att?.[0] || null;

    
    const transfers = [
      ...(empData?.transfers || []),
      ...(hoData?.transfers || []),
      ...(attData?.transfers || [])
    ];

    
    const base = empData || hoData || attData;

    this.history = base
      ? {
          name: base.name,
          period: base.period,
          resigned: base.resigned,
          resign_date: base.resign_date,
          transfers
        }
      : null;

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
