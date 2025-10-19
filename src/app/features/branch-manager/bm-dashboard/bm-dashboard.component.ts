import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchManagerService } from '../branch-manager.service';
import { AuthService } from '../../../auth.service';
import { PeriodService } from '../../../core/period.service';

@Component({
  selector: 'app-bm-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bm-dashboard.component.html',
  styleUrls: ['./bm-dashboard.component.css']
})
export class BmDashboardComponent implements OnInit {
  dashboardCounts: any;
  period!: string;
  branchId = this.auth.user?.branchId;

  constructor(
    private branchManagerService: BranchManagerService,
    private auth: AuthService,
    private periodService: PeriodService
  ) { }

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe(period => {
      this.period = period;
      if (this.branchId) {
        this.branchManagerService.getDashboardCounts(this.period, this.branchId).subscribe(data => {
          this.dashboardCounts = data;
        });
      }
    });
  }
}
