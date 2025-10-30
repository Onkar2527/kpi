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

  constructor(
    private staffService: StaffService,
    public auth: AuthService,
    private sharedService: SharedService,
    private branchManagerService: BranchManagerService,
    private kpisService: KpisService,
    private periodService: PeriodService
  ) { }

  ngOnInit(): void {
    this.periodService.currentPeriod.pipe(
      filter(p => !!p)
    ).subscribe(period => {
      this.period = period;
      this.loadTargets();
    });

    this.sharedService.entryVerified$.subscribe(() => {
      if (this.period) { // Only reload if period is set
        this.loadTargets();
      }
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
                  kpi: kpi.kpi_name, // Use the proper name
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
console.log(target);
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
    this.grandTotalWeightageScore = this.personalTotalWeightageScore + this.branchTotalWeightageScore;
  }
}
