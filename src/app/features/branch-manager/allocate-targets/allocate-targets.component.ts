import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchManagerService } from '../branch-manager.service';
import { AuthService } from '../../../auth.service';
import { PeriodService } from '../../../core/period.service';

@Component({
  selector: 'app-allocate-targets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './allocate-targets.component.html',
  styleUrls: ['./allocate-targets.component.css']
})
export class AllocateTargetsComponent implements OnInit {
  period!: string;
  branchId = this.auth.user?.branchId;
  targets: any;
  allocations: any;

  constructor(
    private branchManagerService: BranchManagerService,
    private auth: AuthService,
    private periodService: PeriodService
  ) { }

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe(period => {
      this.period = period;
      if (this.branchId) {
        this.branchManagerService.getBranchTargets(this.period, this.branchId).subscribe((data: any) => {
          this.targets = data.filter((t: any) => ['deposit', 'loan_gen', 'loan_amulya'].includes(t.kpi));
        });
        this.loadAllocations();
      }
    });
  }

  loadAllocations() {
    if (this.branchId) {
      this.branchManagerService.getAllocations(this.period, this.branchId).subscribe((data: any) => {
        const allocationsByStaff: any = {};
        for (const alloc of data) {
          if (!allocationsByStaff[alloc.user_id]) {
            allocationsByStaff[alloc.user_id] = {
              staffId: alloc.user_id,
              staffName: alloc.staffName,
            };
          }
          allocationsByStaff[alloc.user_id][alloc.kpi] = alloc.amount;
        }
        this.allocations = Object.values(allocationsByStaff);
      });
    }
  }

  autoDistribute() {
    if (this.branchId) {
      this.branchManagerService.autoDistributeTargets(this.period, this.branchId).subscribe(() => {
        this.loadAllocations();
      });
    }
  }

  publish() {
    if (this.branchId) {
      this.branchManagerService.publishAllocations(this.period, this.branchId).subscribe(() => {
        this.loadAllocations();
      });
    }
  }

  calculateTotal(kpi: string): number {
    if (!this.allocations) {
      return 0;
    }
    return this.allocations.reduce((acc: number, curr: any) => acc + (curr[kpi] || 0), 0);
  }
}
