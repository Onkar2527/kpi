import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PerformanceService } from '../performance.service';
import { AuthService } from '../../../auth.service';
import { PeriodService } from '../../../core/period.service';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../admin/admin.service';
import { AllPerformanceModule } from '../../all-performnace/all-performance.module';
import { AllPerformanceService } from '../../all-performnace/all-performance.service';

@Component({
  selector: 'app-attender-kpis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attender-kpis.component.html',
  styleUrls: ['./attender-kpis.component.scss'],
})
export class AttenderKpisComponent implements OnInit {
  period!: string;
  branchId = this.auth.user?.branchId;
  scores: any;
  history: any;
  history1: any; 
    attenderScores:any;
    allStaffSalaries: any;
    selectedEmployee: any;
    staffSalary=0;
    staffIncrementAmt=0;
    staffTotalScore: any;    
    kpiList: any;
    originalScores: any;
  constructor(
    private performanceService: PerformanceService,
    private performance_all:AllPerformanceService,
    public auth: AuthService,
    private periodService: PeriodService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;

      if (this.branchId) {
        if (this.auth.user?.role === 'BM') {
            this.getAttenderScore(this.period, this.branchId);
        } 
      }
      this.getAllStaffSalary(this.period, this.branchId!);
      this.loadKpiroleWise()
      this.transferHistory();
      
    });
  }
 loadKpiroleWise() {
    const payload = { role: 'Attender' };
    this.performance_all.getAllKpiRoleWise(payload).subscribe((res: any) => {
      this.kpiList = res.data;
    });
  }
  getAttenderScore(period: string, branchId: string){
    this.performanceService
      .getAttenderScores(period, branchId)
      .subscribe((data) => {
        this.attenderScores = data;
        if (this.attenderScores.length > 0) {
              this.selectEmployee(this.attenderScores[0]);
            }
      });
  }
  getAllStaffSalary(period: string, branch_id: string) {
    this.performanceService
      .getAllStaffSalary(period, branch_id)
      .subscribe((data: any) => {
        this.allStaffSalaries = data;

        const staff = this.allStaffSalaries.find(
          (s: any) => s.id === this.selectedEmployee.staffId
        );
        if (staff === undefined) {
          this.staffSalary = 0;
          this.staffIncrementAmt = 0;
          return;
        } else {
          this.staffSalary = staff.salary || 0;
          this.staffIncrementAmt = staff.increment || 0;
        }
      });
  }

  transferHistory() {
    this.adminService
      .getTrafterKpiHistory(this.period, this.auth.user?.id)
      .subscribe((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          this.history = data[0];
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
        } else {
          this.history1 = null;
        }
      });
  }
  

  selectEmployee(employee: any) {
    this.selectedEmployee = employee;
    this.getAllStaffSalary(this.period, this.branchId!);
    this.originalScores = JSON.parse(JSON.stringify(this.selectedEmployee));
   
    this.transferStaffHistory();
  }

 submitScores() {
  if (!this.selectedEmployee || !this.kpiList) return;


  const kpiListToUse = this.kpiList;

  const changedScores = kpiListToUse
    .filter((k: any) => k.kpi_name.toLowerCase() !== 'insurance target')
    .filter((k: any) => {
      const newVal = this.selectedEmployee.kpis[k.kpi_name]?.achieved;
      const oldVal = this.originalScores.kpis[k.kpi_name]?.achieved;
      return newVal !== undefined && newVal !== oldVal;
    })
    .map((k: any) => ({
      kpi_name: k.kpi_name,
      role_kpi_mapping_id: k.id,
      value: this.selectedEmployee.kpis[k.kpi_name].achieved,
    }));

  if (changedScores.length === 0) {
    alert("No changes detected");
    return;
  }

  const payload = {
    user_id: this.selectedEmployee.staffId,
    period: this.period,
    master_user_id: this.auth.user?.id,
    scores: changedScores,
  };

  this.performance_all.createHoStaffScores(payload).subscribe({
    next: (res: any) => {
      alert(res.message || "Scores saved successfully");
      this.getAttenderScore(this.period, this.branchId!);
    },
    error: (err) => {
      console.error(err);
      alert("Failed to save scores");
    },
  });
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
