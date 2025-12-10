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
  AGMsalary = 0; 
  AGMincrementAmt = 0;
  HOsalary = 0; 
  HOincrementAmt = 0;
  kpiList: any;
  kpiListStaff: any;
  hodTotalScore: any;
  allStaffSalaries: any;
  constructor(
    private performanceService: AllPerformanceService,
    public auth: AuthService,
    private periodService: PeriodService,
     private performanceServicestaff: PerformanceService
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
      if (this.HODId) {
        if (this.auth.user?.role === 'AGM' ||this.auth.user?.role === 'DGM') {
          this.performanceService
            .getHoScores(this.period, this.HODId, this.auth.user?.role)
            .subscribe((data: any) => {
              this.hodScores = data.kpis;
              this.hodTotalScore = data.total;
            });
        } else if (
          this.auth.user?.role === 'HO_STAFF' ||
          this.auth.user?.role === 'attender'
        ) {
          const userId = this.auth.user?.id ?? '';
          this.performanceService
            .getSpecificALLScores(
              this.period,
              this.auth.user?.id,
              this.auth.user?.role
            )
            .subscribe((data: any) => {
              this.hostaffScores = data;
            });
        }
        this.getSalary(this.period, this.auth.user?.username);
        this.loadScores();
        this.loadKpiroleWise();
        this.loadKpiroleWiseStaff();
      }
    });
  }
  loadScores() {
    this.performanceService
      .getScores(this.period, this.HODId, 'HO_STAFF')
      .subscribe((data: any) => {
        this.scores = data;
        if (this.scores.length > 0) {
          this.selectedEmployee = this.scores[0];
        }
      });
  }
 getSalary(period: any, PF_NO: any) {
    this.performanceServicestaff.getSalary(period, PF_NO).subscribe((data: any) => {
      this.AGMsalary = data[0].salary || 0;
      this.AGMincrementAmt = data[0].increment || 0;
    });
  }
   getAllHOStaffSalary(period: string, branch_id: string) {
    this.performanceServicestaff
      .getAllStaffSalary(period, branch_id)
      .subscribe((data: any) => {
        this.allStaffSalaries = data;

        const staff = this.allStaffSalaries.find(
          (s: any) => s.id === this.selectedEmployee.staffId
        );
        if (staff === undefined) {
          this.HOsalary = 0;
          this.HOincrementAmt = 0;
          return;
        }else {
          this.HOsalary = staff.salary || 0;
          this.HOincrementAmt = staff.increment || 0;
        }
      });
  }
  loadKpiroleWise() {
    const payload = { role: this.auth.user?.role };
    this.performanceService.getAllKpiRoleWise(payload).subscribe((res: any) => {
      this.kpiList = res.data;
    });
  }
  loadKpiroleWiseStaff() {
    const payload = { role: 'HO_STAFF' };
    this.performanceService.getAllKpiRoleWise(payload).subscribe((res: any) => {
      this.kpiListStaff = res.data;
    });
  }
  selectEmployee(employee: any) { 
    this.selectedEmployee = employee;
    this.loadKpiroleWiseStaff();
    this.getAllHOStaffSalary(this.period, this.branchId!);
  }

  submitScores() {
    if (!this.selectedEmployee) return;

    const payload = {
      user_id: this.selectedEmployee.staffId,
      period: this.period,
      master_user_id: this.HODId,
      scores: this.kpiListStaff
        .filter((k: any) => k.kpi_name.toLowerCase() !== 'insurance')
        .map((k: any) => ({
          kpi_name: k.kpi_name,
          role_kpi_mapping_id: k.id,
          value: this.selectedEmployee[k.kpi_name]?.achieved || 0,
        })),
    };

    console.log(payload);

    this.performanceService.createHoStaffScores(payload).subscribe({
      next: (response: any) =>
        alert(response.message || 'Scores created successfully!'),
      complete: () => this.loadScores(),
      error: (err) => console.error('Error creating scores:', err),
    });
  }
  finalSalary() {
    const finalSalary = this.calculateTotalSalary() * 0.25;
    return finalSalary + this.calculateTotalSalary();
  }

  calculateKpiBasedIncrement() {
    if (!this.hodScores) return 0;
    const score = this.hodTotalScore;
    if (score < 5) return 0;
    if (score >= 5 && score < 10) return this.AGMincrementAmt * (score / 10);
    if (score >= 10 && score < 12.5) return this.AGMincrementAmt;
    return this.AGMincrementAmt * 1.25;
  }

  calculateTotalSalary() {
    return this.AGMsalary + this.calculateKpiBasedIncrement();
  }
   finalSalaryHOStaff() {
    const finalSalary = this.calculateTotalSalary() * 0.25;
    return finalSalary + this.calculateTotalSalary();
  }

  calculateKpiBasedIncrementHOStaff() {
    if (!this.hodScores) return 0;
    const score = this.hodTotalScore;
    if (score < 5) return 0;
    if (score >= 5 && score < 10) return this.HOincrementAmt * (score / 10);
    if (score >= 10 && score < 12.5) return this.HOincrementAmt;
    return this.HOincrementAmt * 1.25;
  }

  calculateTotalSalaryHOStaff() {
    return this.HOsalary + this.calculateKpiBasedIncrement();
  }
}
