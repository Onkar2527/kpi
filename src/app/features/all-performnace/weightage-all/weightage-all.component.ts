import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerformanceService } from '../../performance/performance.service';
import { AuthService } from '../../../auth.service';
import { PeriodService } from '../../../core/period.service';
import { AllPerformanceService } from '../all-performance.service';
import { AdminService } from '../../admin/admin.service';

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
  hod_id=this.auth.user?.hod_id ?? '';
  hodScores: any;
  hostaffScores: any;
  selectedEmployee: any;
  AGMsalary = 0;
  AGMincrementAmt = 0;
  ALLAGMsalary = 0;
  ALLAGMincrementAmt = 0;
  attenderTransferScores: any;
  GMsalary = 0;
  GMincrementAmt = 0;
  HOsalary = 0;
  HOincrementAmt = 0;
  kpiList: any;
  kpiListStaff: any;
  kpiListAGM: any;
  hodTotalScore: any;
  allStaffSalaries: any;
  AGMArray: any[] = [];
  agmScore: any;
  gmFinalTotal: number = 0;
 fixedWeightage: number = 10;
  totalAGMsScore: number = 0;
 originalScores: any = {};
 isGmScoreLoading = false;
 isHodScoreLoading = true;
  hostaffScores1: any;
  clerkHistory: any;
  mergeHistoryed: any;
  isLoading: boolean = false;
  constructor(
    private performanceService: AllPerformanceService,
    public auth: AuthService,
    private periodService: PeriodService,
    private performanceServicestaff: PerformanceService,
    private adminService:AdminService
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
      if (this.HODId && this.period) {
        if (
          this.auth.user?.role === 'AGM' ||
          this.auth.user?.role === 'DGM' ||
          this.auth.user?.role === 'AGM_AUDIT' ||
          this.auth.user?.role === 'AGM_IT' ||
          this.auth.user?.role === 'AGM_INSURANCE'
        ) {
          this.loadHodScores();
        } else if (
          this.auth.user?.role === 'HO_STAFF' ||
          this.auth.user?.role === 'attender'
        ) {
          const userId = this.auth.user?.id ?? '';
          this.performanceService
            .getSpecificALLScores(
              this.period,
              this.auth.user?.id,
              this.auth.user?.role,
              this.hod_id
            )
            .subscribe((data: any) => {
              this.hostaffScores = data;
            });
             this.transferStaffHistory();
             this.transferHOStaffHistory();
        } else if (this.auth.user?.role === 'GM') {
          this.loadAGMScores();
        }
        this.getSalary(this.period, this.auth.user?.PF_NO);
        this.getGMSalary(this.period, this.auth.user?.PF_NO);
        
        if (
          this.auth.user?.role === 'AGM' ||
          this.auth.user?.role === 'DGM' ||
          this.auth.user?.role === 'AGM_AUDIT' ||
          this.auth.user?.role === 'AGM_IT' ||
          this.auth.user?.role === 'AGM_INSURANCE'
        ) {
          this.loadScores();
          this.loadKpiroleWise();
          this.loadKpiroleWiseStaff();
        } else if (this.auth.user?.role === 'GM') {
          this.loadKpiroleWiseAGM(this.selectedEmployee.role);
        }else{
          this.loadKpiroleWise();
        }
        this.getAGMSalary(this.period, this.HODId);
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
loadHodScores() {
  this.isHodScoreLoading = true;

 this.performanceService
            .getHoScores(this.period, this.HODId, this.auth.user!.role).subscribe({
    next: (res:any) => {
      this.hodScores = res.kpis;
      this.hodTotalScore = res.total;
    },
    error: () => {
      this.hodScores = null;
      this.hodTotalScore = 0;
    },
    complete: () => {
      this.isHodScoreLoading = false;
    }
  });
}

loadAGMScores() {
  this.isGmScoreLoading = true;   

  this.performanceService
    .getAllAGMScores(this.period)
    .subscribe({
      next: (data: any) => {
        this.agmScore = data || [];

        if (this.agmScore.length > 0) {
          this.selectEmployee(this.agmScore[0]);
        }

        const totalAGMs = data.length || 1;
        const totalWeightage = 100;
        const perAGMWeightage = totalWeightage / totalAGMs;

        this.AGMArray = data.map((agm: any) => ({
          hod_id: agm.hod_id,
          name: agm.name,
          total_score: agm.total,
          weightage: perAGMWeightage,
          weightageScore: (perAGMWeightage * agm.total) / 100
        }));

        this.totalAGMsScore = data.reduce(
          (acc: number, x: any) => acc + x.total,
          0
        );

        this.gmFinalTotal = this.AGMArray.reduce(
          (acc: number, x: any) => acc + x.weightageScore,
          0
        );
      },
      error: (err) => {
        console.error(err);
        this.agmScore = [];
        this.AGMArray = [];
        this.totalAGMsScore = 0;
        this.gmFinalTotal = 0;
      },
      complete: () => {
        this.isGmScoreLoading = false;  
      }
    });
}

  loadScores() {
  this.isLoading = true;   

  this.performanceService
    .getScores(this.period, this.HODId, 'HO_STAFF')
    .subscribe({
      next: (data: any) => {
        this.scores = data;

        if (this.scores?.length > 0) {
          this.selectEmployee(this.scores[0]);
        }
               
        this.isLoading = false;  
      },
      error: (err) => {
        console.error('Error loading scores:', err);
        this.isLoading = false;  
      }
    });
}
  getSalary(period: any, PF_NO: any) {
    this.performanceServicestaff
      .getSalary(period, PF_NO)
      .subscribe((data: any) => {
        this.AGMsalary = data[0]?.salary || 0;
        this.AGMincrementAmt = data[0]?.increment || 0;
      });
  }
  getGMSalary(period: any, PF_NO: any) {
    this.performanceServicestaff
      .getSalary(period, PF_NO)
      .subscribe((data: any) => {
        this.GMsalary = data[0]?.salary || 0;
        this.GMincrementAmt = data[0]?.increment || 0;
      });
  }
   getAGMSalary(period: any, hod_id: any) {
    this.performanceService
      .getAllAGMSalary(period, hod_id)
      .subscribe((data: any) => {
        this.HOsalary = data[0]?.salary || 0;
        this.HOincrementAmt = data[0]?.increment || 0;
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
        } else {
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
  loadKpiroleWiseAGM(role: string) {
    const payload = { role: role };
    this.performanceService.getAllKpiRoleWise(payload).subscribe((res: any) => {
      this.kpiListAGM = res.data;
    });
  }
  selectEmployee(employee: any) {
    if (!employee) return;
    this.selectedEmployee = employee;
    
    
    if (this.selectedEmployee.kpis) {
      Object.keys(this.selectedEmployee.kpis).forEach((key) => {
        this.selectedEmployee[key] = this.selectedEmployee.kpis[key];
      });
    }
    this.originalScores = JSON.parse(JSON.stringify(this.selectedEmployee));
   
    if (
      this.auth.user?.role === 'AGM' ||
      this.auth.user?.role === 'DGM' ||
      this.auth.user?.role === 'AGM_AUDIT' ||
      this.auth.user?.role === 'AGM_IT' ||
      this.auth.user?.role === 'AGM_INSURANCE'
    ) {
      this.loadKpiroleWiseStaff();
      this.getAllHOStaffSalary(this.period, this.branchId!);
      this.transferStaffHistory();
      this.transferAttenderHistory();
      this.transferHOStaffHistory();
      
      this.getAGMSalary(this.period, this.selectedEmployee.staffId);
    }
    if (this.auth.user?.role === 'GM' ) {
       if (this.selectedEmployee?.role)
        this.loadKpiroleWiseAGM(this.selectedEmployee.role);
      this.getAGMSalary(this.period, this.selectedEmployee.hod_id);
    }
     
     
  }
 transferStaffHistory() {

    this.adminService
      .getTrafterKpiHistory(this.period, this.selectedEmployee?.staffId || this.auth.user?.id)
      .subscribe((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          this.clerkHistory = data[0];
          this.mergeHistory();
        } else {
          this.clerkHistory= null;
        }
      });
  }
  transferHOStaffHistory() {
    this.performanceService
      .getHoStaffHistory(this.period, this.selectedEmployee?.staffId || this.auth.user?.id)
      .subscribe((data: any) => {
        this.hostaffScores1 =
          Array.isArray(data) && data.length > 0 ? data[0] : null;
         if (this.hostaffScores1?.length > 0) {
          this.selectedEmployee = this.hostaffScores1[0];
        }
        
        
        this.mergeHistory();
      });
  }
   transferAttenderHistory() {
    if (this.selectedEmployee?.staffId) {
      this.performanceServicestaff
        .getAttenderTransferScore(this.period, this.selectedEmployee?.staffId)
        .subscribe((data: any) => {
          this.attenderTransferScores =
            Array.isArray(data) && data.length > 0 ? data[0] : null;
          this.mergeHistory();
        });
    }
  }
  mergeHistory() {

  if (!this.selectedEmployee) {
    this.selectedEmployee = {};
  }
    const h1 = this.clerkHistory;
    const h2 = this.hostaffScores1;
    const h3 = this.attenderTransferScores;


    if (!h1 && !h2 && !h3) {
      this.mergeHistoryed = null;
      return;
    }

    const transfers = [...(h1?.transfers || []), ...(h2?.transfers || []), ...(h3?.transfers || [])];

    transfers.sort(
      (a: any, b: any) =>
        new Date(a.transfer_date || 0).getTime() -
        new Date(b.transfer_date || 0).getTime(),
    );
      const branch =
        this.clerkHistory?.branch_avg_kpi ||
        this.clerkHistory?.branch_name ||
        null;
      const ho = this.hostaffScores1?.branch_avg_kpi || {};
      const attender = this.attenderTransferScores?.branch_avg_kpi || {};

      this.selectedEmployee.branch_name = {
        ...(attender || {}),
        ...(branch || {}),
        ...(ho || {}),
      };

    this.mergeHistoryed = {
      staff_id: h1?.staff_id ?? h2?.staff_id ?? h3?.staff_id,
      name: h1?.name ?? h2?.name ?? h3?.name,
      period: h1?.period ?? h2?.period ?? h3?.period,
      resigned: h1?.resigned ?? h2?.resigned ?? h3?.resigned,
      transfers,
      total_months: (h1?.total_months || 0) + (h2?.total_months || 0) + (h3?.total_months || 0),
    };


    
  }
  getAverageKpi(): number {

  if (!this.selectedEmployee?.branch_name) return 0;

 const values = Object.entries(this.selectedEmployee.branch_name)
  .map(([_, v]: any) => +v.avg_kpi || 0);

  let total = 0;
  values.forEach(v => total += v);

  total += +this.hostaffScores?.originalTotal ||
           +this.selectedEmployee?.originalTotal ||
           0;

  const count = values.length + 1;

  return count > 0 ? total / count : 0;
}

  hasBranchData(obj: any): boolean {
  return obj && Object.keys(obj).length > 0;
}

  submitScores() {
  if (!this.selectedEmployee) return;

  let kpiListToUse = [];
  if (
    this.auth.user?.role === 'AGM' ||
    this.auth.user?.role === 'DGM' ||
    this.auth.user?.role === 'AGM_AUDIT' ||
    this.auth.user?.role === 'AGM_IT' ||
    this.auth.user?.role === 'AGM_INSURANCE'
  ) {
    kpiListToUse = this.kpiListStaff;
  } else if (this.auth.user?.role === 'GM') {
    kpiListToUse = this.kpiListAGM;
  }

  const changedScores = kpiListToUse
    .filter((k: any) => k.kpi_name.toLowerCase() !== 'insurance')
    .filter((k: any) => {
      const newVal = this.selectedEmployee[k.kpi_name]?.achieved;
      const oldVal = this.originalScores[k.kpi_name]?.achieved;
     
      
      return newVal !== undefined && newVal !== oldVal;
    })
    .map((k: any) => ({
      kpi_name: k.kpi_name,
      role_kpi_mapping_id: k.id,
      value: this.selectedEmployee[k.kpi_name].achieved,
    }));

  if (changedScores.length === 0) {
    alert("No changes detected");
    return;
  }

  const payload = {
    user_id: this.selectedEmployee.staffId || this.selectedEmployee.hod_id,
    period: this.period,
    master_user_id: this.HODId,
    scores: changedScores,
  };

  this.performanceService.createHoStaffScores(payload).subscribe({
    next: (response: any) =>
      alert(response.message || 'Scores created successfully!'),
    complete: () => { if(this.auth.user?.role === 'GM') {this.loadAGMScores();}else{
      this.loadScores();}},
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
    const finalSalary = this.calculateTotalSalaryHOStaff() * 0.25;
    return finalSalary + this.calculateTotalSalaryHOStaff();
  }

  calculateKpiBasedIncrementHOStaff() {
    if (!this.selectedEmployee.total) return 0;
    const score =this.selectedEmployee.total;
    
    if (score < 5) return 0;
    if (score >= 5 && score < 10) return this.HOincrementAmt * (score / 10);
    if (score >= 10 && score < 12.5) return this.HOincrementAmt;
    return this.HOincrementAmt * 1.25;
  }

  calculateTotalSalaryHOStaff() {
    return this.HOsalary + this.calculateKpiBasedIncrementHOStaff();
  }
  
  calculateGMKpiBasedIncrement() {
    if(!this.gmFinalTotal) return 0;
    const score = this.gmFinalTotal;
    if (score < 5) return 0;
    if (score >= 5 && score < 10) return this.GMincrementAmt * (score / 10);
    if (score >= 10 && score < 12.5) return this.GMincrementAmt;
    return this.GMincrementAmt *1.25;
  }
  calculateGMTotalSalary() {
    return this.GMsalary + this.calculateGMKpiBasedIncrement();
  }

  finalGmSalary() {
    const finalSalary = this.calculateGMTotalSalary() * 0.25;
    return finalSalary + this.calculateGMTotalSalary();
  }
}
