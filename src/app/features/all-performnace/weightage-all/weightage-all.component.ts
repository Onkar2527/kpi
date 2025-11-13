import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerformanceService } from '../../performance/performance.service';
import { AuthService } from '../../../auth.service';
import { PeriodService } from '../../../core/period.service';
import { AllPerformanceService } from '../all-performance.service';

@Component({
  selector: 'app-weightage-all',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weightage-all.component.html',
  styleUrls: ['./weightage-all.component.scss'],
})
export class WeightageAllComponent implements OnInit {
  period!: string;
  branchId = this.auth.user?.branchId ?? '';
  scores: any;
  HODId = this.auth.user?.id ?? '';
  hodScores: any;
  hostaffScores: any;
  selectedEmployee: any;
  salary = 35000;
  incrementAmt = 1000;
  kpiList: any;

  constructor(
    private performanceService: AllPerformanceService,
    public auth: AuthService,
    private periodService: PeriodService
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
      if (this.HODId) {
        if (this.auth.user?.role === 'AGM') {
          this.performanceService
            .getHoScores(this.period, this.HODId, this.branchId)
            .subscribe((data: any) => {
              this.hodScores = data.scores;
            });
        } else if (
          this.auth.user?.role === 'HO_STAFF' ||
          this.auth.user?.role === 'attender'
        ) {
          const userId = this.auth.user?.id ?? '';
          this.performanceService
            .getSpecificALLScores(this.period, this.auth.user?.id,this.auth.user?.role)
            .subscribe((data) => {
              this.hostaffScores = data;    
            });
        }

        this.loadScores();
        this.loadKpiroleWise();
      }
    });
  }
  loadScores() {
    this.performanceService
      .getScores(this.period, this.HODId, this.branchId)
      .subscribe((data: any) => {
        this.scores = data;
        if (this.scores.length > 0) {
          this.selectedEmployee = this.scores[0]; 
        }
      });
  }

  loadKpiroleWise() {
    const payload={role:this.auth.user?.role};
    this.performanceService.getAllKpiRoleWise(payload).subscribe((res:any)=>{
      this.kpiList = res.data;   
    });
  }
  selectEmployee(employee: any) {
    this.selectedEmployee = employee;
    // Ensure all KPI objects exist to avoid "undefined" access
    //   this.kpiList.forEach(kpi => {
    //     if (!this.selectedEmployee[kpi]) {
    //       this.selectedEmployee[kpi] = { weightage: 0, achieved: 0, score: 0, weightageScore: 0 };
    //     }
    //   });
  }

  submitScores() {
    //   if (!this.selectedEmployee) return;
    //   const payload = {
    //     branch_id: this.branchId,
    //     period: this.period,
    //     ho_staff_id: this.selectedEmployee.staffId,
    //     hod_id: this.HODId,
    //     scores: this.kpiList.map(kpi => ({
    //       kpi,
    //       achieved: this.selectedEmployee[kpi]?.achieved || 0
    //     }))
    //   };
    // Staff ID missing → Create API
    // this.performanceService.createHoStaffScores(payload).subscribe({
    //   next: (response: any) => alert(response.message || 'Scores created successfully!'),
    //   complete: () => this.loadScores(),
    //   error: err => console.error('Error creating scores:', err)
    // });
  }

  calculateKpiBasedIncrement() {
    if (!this.hodScores) return 0;
    const score = this.hodScores.total;
    if (score < 5) return 0;
    if (score >= 5 && score < 10) return this.incrementAmt * (score / 10);
    if (score >= 10 && score < 12.5) return this.incrementAmt;
    return this.incrementAmt * 1.25;
  }

  calculateTotalSalary() {
    return this.salary + this.calculateKpiBasedIncrement();
  }
}
