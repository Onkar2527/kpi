import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../staff.service';
import { AuthService } from '../../../auth.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';
import { PeriodService } from '../../../core/period.service';

@Component({
  selector: 'app-my-submissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-submissions.component.html',
  styleUrls: ['./my-submissions.component.css']
})
export class MySubmissionsComponent implements OnInit {
  submissions: any;
  filteredSubmissions: any;
  paginatedSubmissions: any;
  employeeId = this.auth.user?.id;
  period!: string;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  depositCount = 0;
  loanGenCount = 0;
  loanAmulyaCount = 0;

  constructor(
    private staffService: StaffService,
    private auth: AuthService,
    private searchService: SearchService,
    private paginationService: PaginationService,
    private periodService: PeriodService
  ) { }

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe(period => {
      this.period = period;
      if (this.employeeId) {
        this.staffService.getMySubmissions(this.period, this.employeeId).subscribe((data: any) => {
          this.submissions = data;
          this.depositCount = data.filter((s: any) => s.kpi === 'deposit').length;
          this.loanGenCount = data.filter((s: any) => s.kpi === 'loan_gen').length;
          this.loanAmulyaCount = data.filter((s: any) => s.kpi === 'loan_amulya').length;
          this.onSearch();
        });
      }
    });
  }

  onSearch(): void {
    this.filteredSubmissions = this.searchService.filterData(this.submissions, this.searchTerm);
    this.totalPages = this.paginationService.getTotalPages(this.filteredSubmissions, this.pageSize);
    this.updatePaginatedSubmissions();
  }

  updatePaginatedSubmissions(): void {
    this.paginatedSubmissions = this.paginationService.getPaginatedData(this.filteredSubmissions, this.currentPage, this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedSubmissions();
  }

  onCardClick(kpi: string): void {
    this.searchTerm = kpi;
    this.onSearch();
  }
}
