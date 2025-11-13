import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PerformanceService } from '../performance.service';
import { AuthService } from '../../../auth.service';
import { PeriodService } from '../../../core/period.service';
import { FormsModule } from '@angular/forms';

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
  staffScores: any;
  selectedEmployee: any;
  BMsalary: any;
  BMincrementAmt : any;
  auditScore: any;
  constructor(
    private performanceService: PerformanceService,
    public auth: AuthService,
    private periodService: PeriodService
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;

      if (this.branchId) {
        if (this.auth.user?.role === 'BM') {
          this.performanceService
            .getBmScores(this.period, this.branchId)
            .subscribe((data) => {
              this.bmScores = data;
            });
        } else if (
          this.auth.user?.role === 'Clerk' ||
          this.auth.user?.role === 'Attender'
        ) {
          this.performanceService
            .getStaffScores(this.period, this.auth.user.id,this.branchId)
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
          });
      }
      this.getSalary(this.period, this.auth.user?.username);
    });
  }
  getSalary(period: any, PF_NO: any) {
    this.performanceService.getSalary(period, PF_NO).subscribe((data: any) => {
      this.BMsalary = data[0].salary || 0;
      this.BMincrementAmt = data[0].increment || 0;
    });
  }
  calculateKpiBasedIncrement() {
    if (!this.bmScores) {
      return 0;
    }
    const score = this.bmScores.total|| 8;
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
    console.log(this.selectedEmployee);
  }
  private auditTimer: any;

  onAuditScoreChange(newValue: number) {
    this.auditScore = newValue;

    clearTimeout(this.auditTimer);
    this.auditTimer = setTimeout(() => {
      this.submitScores();
    }, 800);
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
    console.log('Submitting audit score:', payload);

    this.performanceService.submitAuditScore(payload).subscribe(
      (response: any) => {
        console.log('Response:', response);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
}
