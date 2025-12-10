import { Component, OnInit } from '@angular/core';
import { AllPerformanceService } from '../all-performance.service';
import { AuthService } from 'src/app/auth.service';
import { CommonModule } from '@angular/common';

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

  constructor(
    private performanceService: AllPerformanceService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardCounts();
  }

  loadDashboardCounts() {
    this.performanceService
      .getDashbroadCount(this.auth.user?.id)
      .subscribe((data: any) => {
        this.totalHOStaff = data.totalHOStaff;
        this.totalHOStaffCount = data.totalHOStaffCount;

        this.totalBranches = data.totalBranches;
        this.totalBranchesCount = data.totalBranchesCount;

        this.totalAGMDGM = data.totalAGMDGM;
        this.totalAGMDGMCount = data.totalAGMDGMCount;
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
}
