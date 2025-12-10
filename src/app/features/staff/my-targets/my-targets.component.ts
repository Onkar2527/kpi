import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../staff.service';
import { AuthService } from '../../../auth.service';
import { SharedService } from '../../../core/shared.service';
import { BranchManagerService } from '../../branch-manager/branch-manager.service';
import { KpisService } from '../../kpis/kpis.service';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PeriodService } from '../../../core/period.service';
import { LoginComponent } from '../../login/login.component';
import { PerformanceService } from '../../performance/performance.service';
import { AdminService } from '../../admin/admin.service';

@Component({
  selector: 'app-my-targets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-targets.component.html',
  styleUrls: ['./my-targets.component.css']
})
export class MyTargetsComponent implements OnInit {
  personalTargets: any;
  branchTargets: any;
  personalTotalWeightageScore = 0;
  branchTotalWeightageScore = 0;
  grandTotalWeightageScore = 0;
  employeeId = this.auth.user?.id;
  branchId = this.auth.user?.branchId;
  period!: string;
  staffAll:any;
  salary:any;
  incrementAmt:any;
  history:any;
  branchKpiTotal: number = 0;
 branchKpiAvg: number = 0;

   kpiOrder = [
  "deposit",
  "loan_gen",
  "loan_amulya",
  "recovery",
  "audit",
  "insurance"
];
  constructor(
    private staffService: StaffService,
    public auth: AuthService,
    private sharedService: SharedService,
    private branchManagerService: BranchManagerService,
    private kpisService: KpisService,
    private periodService: PeriodService,
    private performanceService: PerformanceService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.periodService.currentPeriod.pipe(
      filter(p => !!p)
    ).subscribe(period => {
      this.period = period;
      this.loadTargets();
      this.getSalary(this.period, this.auth.user?.username);
      this.transferHistory();
    });

    this.sharedService.entryVerified$.subscribe(() => {
      if (this.period) { // Only reload if period is set
        this.loadTargets();
      }
    });
  }

  getSalary(period: any, PF_NO: any) {
    this.performanceService.getSalary(period, PF_NO).subscribe((data: any) => {
      this.salary = data[0].salary || 0;
      this.incrementAmt = data[0].increment || 0;
      
    });
  }
  calculateKpiBasedIncrement() {
    if (!this.grandTotalWeightageScore) {
      return 0;
    }
    const score = this.grandTotalWeightageScore;
    if (score < 5) {
      return 0;
    }
    if (score >= 5 && score < 10) {
      return this.incrementAmt * (score / 100);
    }
    if (score >= 10 && score < 12.5) {
      return this.incrementAmt;
    }
    return this.incrementAmt * 1.25;
  }
  finalSalary() {
    const finalSalary = this.calculateTotalSalary() * 0.25;
    return finalSalary + this.calculateTotalSalary();
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
 

sortKpis(list: any[]) {
  return list.sort((a, b) => {
    return this.kpiOrder.indexOf(a.kpi) - this.kpiOrder.indexOf(b.kpi);
  });
}

  loadTargets(): void {
    if (this.employeeId && this.branchId) {
      if (this.auth.user?.role === 'attender') {
        forkJoin({
          roleKpis: this.kpisService.getKpisForRole('attender'),
          evaluations: this.kpisService.getEvaluationsForUser(this.employeeId, this.period),
          branch: this.branchManagerService.getBranchTargets(this.period, this.branchId)
        }).subscribe((data: any) => {
          const personalScores: any[] = [];
          const branchScores = this.calculateScores(data.branch);

          data.roleKpis.forEach((kpi: any) => {
            if (kpi.kpi_type === 'manual') {
              const evaluation = data.evaluations.find((ev: any) => ev.role_kpi_id === kpi.id);
              if (evaluation) {
                personalScores.push({
                  kpi: kpi.kpi_name,
                  weightage: kpi.weightage,
                  achieved: evaluation.score,
                  amount: 10,
                  outOf10: evaluation.score,
                  weightageScore: (evaluation.score * kpi.weightage) / 100
                });
              }
            } else if (kpi.kpi_type === 'target_based' && kpi.kpi_name === 'Insurance Target') {
              const branchKpi = branchScores.find(t => t.kpi === 'insurance');
              const branchKpiScore = (branchKpi.outOf10 * kpi.weightage) / 100;
              if (branchKpi) {
                personalScores.push({
                  ...branchKpi,
                  kpi: kpi.kpi_name,
                  weightage: kpi.weightage,
                  
                  weightageScore: branchKpiScore ===0 ? -2 : branchKpiScore

                });
              }
            }
          });
          this.personalTargets = personalScores;
          this.branchTargets = []; // Clear branch targets for attenders
          this.calculateTotals();
        });
      } else {
        this.staffService.getMyTargets(this.period, this.employeeId, this.branchId).subscribe((data: any) => {
          this.personalTargets = this.calculateScores(data.personal);
          this.branchTargets = this.calculateScores(data.branch);
          console.log(this.personalTargets);
          console.log('branch',this.branchTargets);
          
          this.staffAll=this.sortKpis([...this.personalTargets,...this.branchTargets]);
          
         
          
          
          this.calculateTotals();
        });
      }
    }
  }

calculateScores(targets: any[]): any[] {
  if (!Array.isArray(targets)) {
    return [];
  }

  return targets.map(target => {
    let outOf10;
    if(target.amount===0){
      outOf10=0;
      return {
        ...target,
        outOf10,
        weightageScore:
          target.kpi === 'insurance' && (target.weightage === 0 || target.achieved === 0)
            ? -2
            : isNaN((outOf10 * target.weightage) / 100)
            ? 0
            : (outOf10 * target.weightage) / 100
      };
    }
    
    const ratio = target.achieved / target.amount;
    const auditRatio = target.kpi === 'audit' ? target.achieved / target.amount : 0;
    const recoveryRatio = target.kpi === 'recovery' ? target.achieved / target.amount : 0;

    switch (target.kpi) {
      case 'deposit':
      case 'loan_gen':
        if (ratio < 1) outOf10 = ratio * 10;
        else if (ratio < 1.25) outOf10 = 10;
        else if (auditRatio >= 0.75 && recoveryRatio >= 0.75) outOf10 = 12.5;
        else outOf10 = 10;
        break;

      case 'loan_amulya':
        if (ratio < 1) outOf10 = ratio * 10;
        else if (ratio < 1.25) outOf10 = 10;
        else outOf10 = 12.5;
        break;

      case 'insurance':
        if (ratio === 0) outOf10 = 0;
        else if (ratio < 1) outOf10 = ratio * 10;
        else if (ratio < 1.25) outOf10 = 10;
        else outOf10 = 12.5;
        break;

      case 'recovery':
      case 'audit':
        if (ratio < 1) outOf10 = ratio * 10;
        else outOf10 = 12.5;
        break;

      default:
        outOf10 = 0;
    }

    outOf10 = Math.max(0, Math.min(12.5, isNaN(outOf10) ? 0 : outOf10));

    return {
      ...target,
      outOf10,
      weightageScore:
        target.kpi === 'insurance' && (target.weightage === 0 || target.achieved === 0)
          ? -2
          : isNaN((outOf10 * target.weightage) / 100)
          ? 0
          : (outOf10 * target.weightage) / 100
    };
    
  });
}


  calculateTotals(): void {
    this.personalTotalWeightageScore = this.personalTargets?.reduce((acc: any, target: any) => acc + target.weightageScore, 0) || 0;
    this.branchTotalWeightageScore = this.branchTargets?.reduce((acc: any, target: any) => acc + target.weightageScore, 0) || 0;
    this.grandTotalWeightageScore = this.personalTotalWeightageScore + this.branchTotalWeightageScore +this.branchKpiAvg ;
  }

   transferHistory() {
    this.adminService
      .getTrafterKpiHistory(this.period, this.auth.user?.id)
      .subscribe((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          this.history = data[0];
          this.calculateBranchKpiTotals();
          console.log(this.branchKpiAvg );
          
        } else {
          this.history = null;
        }
      });
  } 
  calculateBranchKpiTotals() {
  if (!this.history || !this.history.transfers) {
    this.branchKpiTotal = 0;
    return;
  }


  const branchTotals = this.history.transfers.map(
    (t: any) => t.total_weightage_score || 0
  );

 
  this.branchKpiTotal = branchTotals.reduce((acc: number, val: number) => acc + val, 0);

  
  this.branchKpiAvg = 
    branchTotals.length > 0 
      ? this.branchKpiTotal / branchTotals.length 
      : 0;
}

}
