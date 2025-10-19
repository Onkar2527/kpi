import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceService } from '../performance.service';
import { AuthService } from '../../../auth.service';
import { PeriodService } from '../../../core/period.service';

@Component({
  selector: 'app-weightage-increment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weightage-increment.component.html',
  styleUrls: ['./weightage-increment.component.css']
})
export class WeightageIncrementComponent implements OnInit {
  period!: string;
  branchId = this.auth.user?.branchId;
  scores: any;
  bmScores: any;
  staffScores: any;
  selectedEmployee: any;
  salary = 35000; // This should be dynamic in a real app
  incrementAmt = 1000; // This should be dynamic in a real app

  constructor(
    private performanceService: PerformanceService,
    public auth: AuthService,
    private periodService: PeriodService
  ) { }

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe(period => {
      this.period = period;
      
      if (this.branchId) {
        if (this.auth.user?.role === 'BM') {
          this.performanceService.getBmScores(this.period, this.branchId).subscribe(data => {
            this.bmScores = data;
          });
        } else if (this.auth.user?.role === 'Clerk' || this.auth.user?.role === 'Attender') {
          this.performanceService.getStaffScores(this.period, this.auth.user.id).subscribe(data => {
            this.staffScores = data;
          });
        }
        this.performanceService.getScores(this.period, this.branchId).subscribe((data: any) => {
          this.scores = data;
          if (this.scores.length > 0) {
            this.selectedEmployee = this.scores[0];
          }
        });
      }
    });
  }

  calculateKpiBasedIncrement() {
    if (!this.bmScores) {
      return 0;
    }
    const score = this.bmScores.total;
    if (score < 5) {
      return 0;
    }
    if (score >= 5 && score < 10) {
      return this.incrementAmt * (score / 10);
    }
    if (score >= 10 && score < 12.5) {
      return this.incrementAmt;
    }
    return this.incrementAmt * 1.25;
  }

  calculateTotalSalary() {
    return this.salary + this.calculateKpiBasedIncrement();
  }

  calculateStaffKpiBasedIncrement(score: number) {
    if (score < 5) {
      return 0;
    }
    if (score >= 5 && score < 10) {
      return this.incrementAmt * (score / 10);
    }
    if (score >= 10 && score < 12.5) {
      return this.incrementAmt;
    }
    return this.incrementAmt * 1.25;
  }

  calculateStaffTotalSalary(score: number) {
    return this.salary + this.calculateStaffKpiBasedIncrement(score);
  }

  selectEmployee(employee: any) {
    this.selectedEmployee = employee;
  }
}
