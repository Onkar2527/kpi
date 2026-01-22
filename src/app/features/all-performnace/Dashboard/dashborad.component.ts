import { Component, OnInit } from '@angular/core';
import { AllPerformanceService } from '../all-performance.service';
import { AuthService } from 'src/app/auth.service';
import { CommonModule } from '@angular/common';
import { PeriodService } from 'src/app/core/period.service';
import { PerformanceService } from '../../performance/performance.service';

declare var bootstrap: any;

@Component({
  selector: 'app-dashboard-AGM',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashborad.component.html',
  styleUrls: ['./dashborad.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalHOStaff: any[] = [];
  totalHOStaffCount: number = 0;

  totalBranches: any[] = [];
  totalBranchesCount: number = 0;

  totalAGMDGM: any[] = [];
  totalAGMDGMCount: number = 0;
  isDashboardLoading = false;
  period: any;
  selectedBranch: any = null;
  bmScores:any;

  constructor(
    private performanceService: AllPerformanceService,
    private bmPerformanceService:PerformanceService,
    private periodService: PeriodService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
      if (this.period) {
        this.loadDashboardCounts();
      }
    });
  }

  loadDashboardCounts() {
    this.isDashboardLoading = true;

    this.performanceService
      .getDashbroadCount(this.auth.user?.id, this.period)
      .subscribe({
        next: (data: any) => {
          this.totalHOStaff = data.totalHOStaff;
          this.totalHOStaffCount = data.totalHOStaffCount;

          this.totalBranches = data.totalBranches;
          this.totalBranchesCount = data.totalBranchesCount;

          this.totalAGMDGM = data.totalAGMDGM;
          this.totalAGMDGMCount = data.totalAGMDGMCount;
        },
        error: (err) => {
          console.error('Dashboard load failed', err);

          this.totalHOStaffCount = 0;
          this.totalBranchesCount = 0;
          this.totalAGMDGMCount = 0;
        },
        complete: () => {
          this.isDashboardLoading = false;
        },
      });
  }

  openHOStaffModal() {
    (document.activeElement as HTMLElement)?.blur();
    const modalEl = document.getElementById('hoStaffModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  openBranchesModal() {
    (document.activeElement as HTMLElement)?.blur();
    const modalEl = document.getElementById('branchesModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  openAGMDGMModal() {
    (document.activeElement as HTMLElement)?.blur();
    const modalEl = document.getElementById('agmDgmModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  reviewBranch(branch: any) {
    this.selectedBranch = branch;
       this.bmPerformanceService
        .getBmScores(this.period, this.selectedBranch.code)
        .subscribe((data) => {
          this.bmScores = data;
        });

      const modal = new bootstrap.Modal(
        document.getElementById('branchReportModal')
      );
      modal.show();
  }
}
