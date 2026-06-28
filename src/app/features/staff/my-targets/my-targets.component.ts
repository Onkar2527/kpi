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
import { AllPerformanceService } from '../../all-performnace/all-performance.service';

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
 attenderTransferScores: any;

   kpiOrder = [
  "deposit",
  "loan_gen",
  "loan_amulya",
  "recovery",
  "audit",
  "insurance"
];
  hostaffScores: any;
  mergeHistoryed: any;
 hoKpiTotal: number = 0;
hoKpiAvg: number = 0;
  constructor(
    private staffService: StaffService,
    public auth: AuthService,
    private sharedService: SharedService,
    private branchManagerService: BranchManagerService,
    private kpisService: KpisService,
    private periodService: PeriodService,
    private performanceService: PerformanceService,
    private adminService: AdminService,
    private al:AllPerformanceService
  ) { }

  ngOnInit(): void {
    this.periodService.currentPeriod.pipe(
      filter(p => !!p)
    ).subscribe(period => {
      this.period = period;
      this.loadTargets();
      this.getSalary(this.period, this.auth.user?.username);
      this.transferStaffHistory();
      this.transferAttenderHistory();
      this.transferHOStaffHistory();
      this.transferAttenderHistory();
    });

    this.sharedService.entryVerified$.subscribe(() => {
      if (this.period) { // Only reload if period is set
        this.loadTargets();
      }
    });
  }

  getSalary(period: any, PF_NO: any) {
    this.performanceService.getSalary(period, PF_NO).subscribe((data: any) => {
      this.salary = data[0]?.salary || 0;
      this.incrementAmt = data[0]?.increment || 0;
      
    });
  }
  calculateKpiBasedIncrement() {
    if (!this.grandTotalWeightageScore) {
      return 0;
    }
    const score = this.getTransferAverage() || this.grandTotalWeightageScore || 0;
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
 finalSalary(): number {

  const totalSalary =
    Number(this.calculateTotalSalary()) || 0;

  const incentive = totalSalary * 0.25;

  const finalSalary = totalSalary + incentive;

  return Number(finalSalary.toFixed(2));
}

calculateTotalSalary(): number {

  const salary = Number(this.salary) || 0;

  const kpiIncrement =
    Number(this.calculateKpiBasedIncrement()) || 0;

  return salary + kpiIncrement;
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
          const fullData=[...data.personal,...data.branch];
          this.personalTargets = this.calculateScores(fullData);
  
          this.staffAll=this.sortKpis([...this.personalTargets]);
  
          this.calculateTotals();
        });
      }
    }
  }

calculateScores(targets: any[]): any[] {
  if (!Array.isArray(targets)) {
    return [];
  }

  const auditObj = targets.find(t => t.kpi === 'audit');
  const recoveryObj = targets.find(t => t.kpi === 'recovery');

  const auditRatio = auditObj ? auditObj.achieved / auditObj.amount : 0;
  const recoveryRatio = recoveryObj ? recoveryObj.achieved / recoveryObj.amount : 0;

  return targets.map(target => {
    const baseline = Number(target.baseline) || 0;

    // If achieved is equal to or less than baseline (previous period carry-over), score = 0
    const isBaselineOnly =
      ['deposit', 'loan_gen', 'loan_amulya'].includes(target.kpi) &&
      baseline > 0 &&
      Number(target.achieved) <= baseline;

    if (isBaselineOnly) {
      return {
        ...target,
        achieved: 0,
        outOf10: 0,
        weightageScore: 0,
      };
    }

    let outOf10;

    if (target.amount === 0) {
      outOf10 = 0;
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

    switch (target.kpi) {
      case 'deposit':
      case 'loan_gen':
      case 'loan_amulya':
        if (ratio <= 1) outOf10 = ratio * 10;
        else if (ratio <= 1.25) outOf10 = 10;
        else if (auditRatio >= 0.75 && recoveryRatio >= 0.75) outOf10 = 12.5;
        else outOf10 = 10;
        break;

      case 'insurance':
        if (ratio === 0) outOf10 = 0;
        else if (ratio < 1) outOf10 = ratio * 10;
        else if (ratio < 1.25) outOf10 = 10;
        else outOf10 = 12.5;
        break;

      case 'recovery':
      case 'audit':
        if (ratio <= 1) outOf10 = ratio * 10;
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
    this.grandTotalWeightageScore = this.personalTotalWeightageScore + this.branchTotalWeightageScore ;
    
    
  }

  transferStaffHistory() {
    this.adminService
      .getTrafterKpiHistory(this.period, this.auth.user?.id)
      .subscribe((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          this.history = data[0];
          this.mergeHistory();
        } else {
          this.history = null;
        }
      });
  }
  transferHOStaffHistory() {
    this.al
      .getHoStaffHistory(this.period, this.auth.user!.id)
      .subscribe((data: any) => {
        this.hostaffScores =
          Array.isArray(data) && data.length > 0 ? data[0] : null;
  
        
        this.mergeHistory();
      });
  }
  transferAttenderHistory() {
    
      this.performanceService
        .getAttenderTransferScore(this.period, this.auth.user!.id)
        .subscribe((data: any) => {
          this.attenderTransferScores =
            Array.isArray(data) && data.length > 0 ? data[0] : null;
          this.mergeHistory();
        });
    
  }
  mergeHistory() {


    const h1 = this.history;
    const h2 = this.hostaffScores;
    const h3 = this.attenderTransferScores;


    if (!h1 && !h2 && !h3 ) {
      this.mergeHistoryed = null;
      return;
    }

    const transfers = [...(h1?.transfers || []), ...(h2?.transfers || []), ...(h3?.transfers || [])];

    transfers.sort(
      (a: any, b: any) =>
        new Date(a.transfer_date || 0).getTime() -
        new Date(b.transfer_date || 0).getTime(),
    );

    this.mergeHistoryed = {
      staff_id: h1?.staff_id ?? h2?.staff_id ?? h3?.staff_id,
      name: h1?.name ?? h2?.name ?? h3?.name,
      period: h1?.period ?? h2?.period ?? h3?.period,
      resigned: h1?.resigned ?? h2?.resigned ?? h3?.resigned,
      transfers: transfers || [],
      total_months: (h1?.total_months || 0) + (h2?.total_months || 0) + (h3?.total_months || 0),
    };


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

// Returns all old-branch scores (excluding insurance) from transfer history
getAllTransferValuesExclInsurance(): number[] {
  const branch =
    this.history?.transfers?.map((t: any) => +t.total_weightage_score || 0) || [];

  const ho =
    this.hostaffScores?.transfers?.map((t: any) => +t.total_weightage_score || 0) || [];

  const attender =
    this.attenderTransferScores?.transfers?.map((t: any) => +t.total_weightage_score || 0) || [];

  return [...branch, ...ho, ...attender];
}

// Returns the current branch score excluding insurance
getCurrentScoreExclInsurance(): number {
  if (!this.staffAll) return 0;
  let total = 0;
  this.staffAll.forEach((t: any) => {
    if (t.kpi !== 'insurance') {
      total += Number(t.weightageScore || 0);
    }
  });
  return total;
}

// Returns the current branch insurance score
getInsuranceScore(): number {
  if (!this.staffAll) return 0;
  const ins = this.staffAll.find((t: any) => t.kpi === 'insurance');
  return Number(ins?.weightageScore || 0);
}

// Returns transfer calculation breakdown object (only for Clerk with transfers)
getTransferCalculation(): any {
  const oldBranchScores = this.getAllTransferValuesExclInsurance();
  const hasTransfers = oldBranchScores.length > 0;
  if (!hasTransfers) return null;

  const allTransfers: any[] = [];
  [
    ...(this.history?.transfers || []),
    ...(this.hostaffScores?.transfers || []),
    ...(this.attenderTransferScores?.transfers || [])
  ].forEach((t: any) => {
    const rawScore = Number(t.total_weightage_score || 0);
    const months = Number(t.months || 0);
    const proportionateScore = months > 0 ? (rawScore / 12) * months : rawScore;
    allTransfers.push({
      branchName: t.old_branch_name || t.branch_name || 'Old Branch',
      kpaScore: rawScore,
      months,
      proportionateScore
    });
  });

  const currentScoreExclInsurance = this.getCurrentScoreExclInsurance();
  const insuranceScore = this.getInsuranceScore();
  const totalCount = allTransfers.length + 1;
  // Use proportionate scores in the average, not raw scores
  const sumOfPrevious = allTransfers.reduce((a: number, b: any) => a + b.proportionateScore, 0);
  const averageExcludingInsurance = (sumOfPrevious + currentScoreExclInsurance) / totalCount;
  const totalFinalKpaScore = averageExcludingInsurance + insuranceScore;

  return {
    transfers: allTransfers,
    currentBranch: { kpaScoreExcludingInsurance: currentScoreExclInsurance },
    averageExcludingInsurance,
    insuranceScore,
    totalFinalKpaScore
  };
}

// Final average used for salary calculation
getTransferAverage(): number {
  const calc = this.getTransferCalculation();
  if (calc) return calc.totalFinalKpaScore;
  return this.grandTotalWeightageScore || 0;
}

// Legacy helpers kept for the Total KPI Score display line
getAllTransferValues(): number[] {
  return [
    ...this.getAllTransferValuesExclInsurance(),
    this.getCurrentScoreExclInsurance()
  ];
}

getTransferTotal(): number {
  return this.getAllTransferValues().reduce((a, b) => a + b, 0);
}


}
