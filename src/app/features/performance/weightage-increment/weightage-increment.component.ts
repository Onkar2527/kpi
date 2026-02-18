import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PerformanceService } from '../performance.service';
import { AuthService } from '../../../auth.service';
import { PeriodService } from '../../../core/period.service';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../admin/admin.service';
import { AllPerformanceService } from '../../all-performnace/all-performance.service';

@Component({
  selector: 'app-weightage-increment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weightage-increment.component.html',
  styleUrls: ['./weightage-increment.component.css'],
})
export class WeightageIncrementComponent implements OnInit {
  period!: string;
  branchId = this.auth.user?.branchId;
  scores: any;
  bmScores: any;
  staffTotalScore: any;
  staffScores: any;
  selectedEmployee: any;
  selectedHOEmployee: any;
  BMsalary: any;
  staffSalary: any;
  BMincrementAmt: any;
  staffIncrementAmt: any;
  auditScore: any;
  history: any;
  allStaffSalaries: any;
  history1: any;
  transferBmScores: any;
  attenderTransferScores: any;
  bmtransferSum: any;
  hostaffScores: any;
  mergeHistoryed: any;
  constructor(
    private performanceService: PerformanceService,
    private al: AllPerformanceService,
    public auth: AuthService,
    private periodService: PeriodService,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;

      if (this.branchId && this.period) {
        if (this.auth.user?.role === 'BM') {
          this.performanceService
            .getBmScores(this.period, this.branchId)
            .subscribe((data) => {
              this.bmScores = data;
            });
        } else if (this.auth.user?.role === 'Clerk') {
          this.performanceService
            .getStaffScores(this.period, this.auth.user.id, this.branchId)
            .subscribe((data) => {
              this.staffScores = data;
            });
        }
        this.performanceService
          .getScores(this.period, this.branchId)
          .subscribe((data: any) => {
            this.scores = data;
            if (this.scores.length > 0) {
              this.selectedEmployee = this.scores[0];
            }
            this.getAllStaffSalary(this.period, this.branchId!);
            this.transferStaffHistory();
            this.transferHOStaffHistory();
            this.transferAttenderHistory();
          });
      }
      this.getSalary(this.period, this.auth.user?.username);
      this.gettrasferBMScore(this.period, this.branchId!);
      this.transferHistory();
    });
  }
  getAverageKpi(): number {
    if (!this.selectedEmployee?.branch_name) return 0;

    const values = Object.entries(this.selectedEmployee.branch_name).map(
      ([_, v]: any) => v,
    );

    let total = 0;
    values.forEach((v: any) => {
      total += +v.avg_kpi;
    });

    total += +this.selectedEmployee.originalTotal;

    const count = values.length + 1;

    return total / count;
  }

  getSalary(period: any, PF_NO: any) {
    if (this.period) {
      this.performanceService
        .getSalary(period, PF_NO)
        .subscribe((data: any) => {
          this.BMsalary = data[0]?.salary || 0;
          this.BMincrementAmt = data[0]?.increment || 0;
        });
    }
  }
  gettrasferBMScore(period: string, branchId: string) {
    if (!this.period) return;
    this.performanceService
      .getBmTransferScores(period, branchId)
      .subscribe((data) => {
        this.transferBmScores = data;
      });
  }

  getAllStaffSalary(period: string, branch_id: string) {
    this.performanceService
      .getAllStaffSalary(period, branch_id)
      .subscribe((data: any) => {
        this.allStaffSalaries = data;

        const staff = this.allStaffSalaries.find(
          (s: any) => s.id === this.selectedEmployee.staffId,
        );
        if (staff === undefined) {
          this.staffSalary = 0;
          this.staffIncrementAmt = 0;
          return;
        } else {
          this.staffSalary = staff?.salary || 0;
          this.staffIncrementAmt = staff?.increment || 0;
        }
      });
  }
  getKpis(transfer: any): string[] {
    if (!transfer) return [];

    const ignore = [
      'transfer_date',
      'total_weightage_score',
      'old_branch_name',
      'new_branch_name',
      'old_designation',
      'new_designation',
    ];

    return Object.keys(transfer).filter((k) => !ignore.includes(k));
  }

  calculateKpiBasedIncrement() {
    if (!this.bmScores) {
      return 0;
    }
    const bmSum = this.bmtransferSum?.sum ?? 0;
    const transferTotal = this.transferBmScores?.total ?? 0;
    const transferCount = this.bmtransferSum?.count ?? 0;
    const score = (bmSum + transferTotal) / (transferCount + 1) || 0;

    if (score < 5) {
      return 0;
    }
    if (score >= 5 && score < 10) {
      return this.BMincrementAmt * (score / 100);
    }
    if (score >= 10 && score < 12.5) {
      return this.BMincrementAmt;
    }
    return this.BMincrementAmt * 1.25;
  }
  finalSalary() {
    const finalSalary = this.calculateTotalSalary() * 0.25;
    return finalSalary + this.calculateTotalSalary();
  }
  calculateTotalSalary() {
    return this.BMsalary + this.calculateKpiBasedIncrement();
  }

  transferHistory() {
    this.adminService
      .getTrafterKpiHistory(this.period, this.auth.user?.id)
      .subscribe((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          this.history = data[0];
          this.bmtransferSum = data.reduce(
            (acc: any, staff: any) => {
              staff.transfers?.forEach((t: any) => {
                const score = Number(t.total_weightage_score);
                if (!isNaN(score)) {
                  acc.sum += score;
                  acc.count++;
                }
              });
              return acc;
            },
            { sum: 0, count: 0 },
          );
        } else {
          this.history = null;
        }
      });
  }
  transferStaffHistory() {
    this.adminService
      .getTrafterKpiHistory(this.period, this.selectedEmployee.staffId)
      .subscribe((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          this.history1 = data[0];
          this.mergeHistory();
        } else {
          this.history1 = null;
        }
      });
  }
  transferHOStaffHistory() {
    this.al
      .getHoStaffHistory(this.period, this.selectedEmployee.staffId)
      .subscribe((data: any) => {
        this.hostaffScores =
          Array.isArray(data) && data.length > 0 ? data[0] : null;
        this.mergeHistory();
      });
  }
  transferAttenderHistory() {
    if (this.selectedEmployee?.staffId) {
      this.performanceService
        .getAttenderTransferScore(this.period, this.selectedEmployee?.staffId)
        .subscribe((data: any) => {
          this.attenderTransferScores =
            Array.isArray(data) && data.length > 0 ? data[0] : null;
          this.mergeHistory();
        });
    }
  }
  mergeHistory() {
    const h1 = this.history1;
    const h2 = this.hostaffScores;
    const h3 = this.attenderTransferScores;

    if (!h1 && !h2 && !h3) {
      this.mergeHistoryed = null;
      return;
    }

    const transfers = [
      ...(h1?.transfers || []),
      ...(h2?.transfers || []),
      ...(h3?.transfers || []),
    ];

    transfers.sort(
      (a: any, b: any) =>
        new Date(a.transfer_date || 0).getTime() -
        new Date(b.transfer_date || 0).getTime(),
    );
    const branch =
      this.history1?.branch_avg_kpi || this.history1?.branch_name || {};
    const ho = this.hostaffScores?.branch_avg_kpi || {};
    const attender = this.attenderTransferScores?.branch_avg_kpi || {};

    this.selectedEmployee.branch_name = {
      ...branch,
      ...ho,
      ...attender,
    };

    this.mergeHistoryed = {
      staff_id: h1?.staff_id ?? h2?.staff_id ?? h3?.staff_id,
      name: h1?.name ?? h2?.name ?? h3?.name,
      period: h1?.period ?? h2?.period ?? h3?.period,
      resigned: h1?.resigned ?? h2?.resigned ?? h3?.resigned,
      transfers,
      total_months:
        (h1?.total_months || 0) +
        (h2?.total_months || 0) +
        (h3?.total_months || 0),
    };
  }

  calculateStaffKpiBasedIncrement(score: number) {
    if (score < 5) {
      return 0;
    }
    if (score >= 5 && score < 10) {
      return this.BMincrementAmt * (score / 100);
    }
    if (score >= 10 && score < 12.5) {
      return this.BMincrementAmt;
    }
    return this.BMincrementAmt * 1.25;
  }

  calculateStaffTotalSalary(score: number) {
    return this.BMsalary + this.calculateStaffKpiBasedIncrement(score);
  }

  selectEmployee(employee: any) {
    this.selectedEmployee = employee;
    this.getAllStaffSalary(this.period, this.branchId!);
    this.transferStaffHistory();
    this.transferHOStaffHistory();
    this.transferAttenderHistory();
  }

  submitScores() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    if (!this.selectedEmployee) return;

    const payload = {
      branch_id: this.branchId,
      period: this.period,
      value: this.selectedEmployee.audit.achieved,
      employee_id: this.selectedEmployee.staffId,
      date: formattedDate,
      status: 'Verified',
      kpi: 'audit',
    };

    this.performanceService.submitAuditScore(payload).subscribe(
      (response: any) => {},
      (error: any) => {
        console.error('Error:', error);
      },
    );
  }

  calculateKpiBasedIncrementStaff() {
    if (!this.staffTotalScore) {
      return 0;
    }
    const score = this.staffTotalScore || 0;
    if (score < 5) {
      return 0;
    }
    if (score >= 5 && score < 10) {
      return this.staffIncrementAmt * (score / 100);
    }
    if (score >= 10 && score < 12.5) {
      return this.staffIncrementAmt;
    }
    return this.staffIncrementAmt * 1.25;
  }
  finalSalaryStaff() {
    const basic = this.calculateTotalSalaryStaff();
    const da = basic * 0.25;
    return basic + da;
  }
  calculateTotalSalaryStaff() {
    return (
      this.staffSalary + this.calculateKpiIncrement(this.selectedEmployee.total)
    );
  }
  calculateKpiIncrement(score: number) {
    if (score < 5) {
      return 0;
    }
    if (score >= 5 && score < 10) {
      return this.staffIncrementAmt * (score / 100);
    }
    if (score >= 10 && score < 12.5) {
      return this.staffIncrementAmt;
    }
    return this.staffIncrementAmt * 1.25;
  }
}
