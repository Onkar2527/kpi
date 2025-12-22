import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';
import { StaffService } from '../../staff/staff.service';
import { PeriodService } from 'src/app/core/period.service';
import { PerformanceService } from '../../performance/performance.service';
import { HoPerformanceService } from '../../hod_performance/hod_performance.service';
import { BranchManagerService } from '../../branch-manager/branch-manager.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-transfer-master',
  standalone  : true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-master.component.html',
  styleUrls: ['./transfer-master.component.scss'],
})
export class TransferMasterComponent implements OnInit {
  TrasferedStaff: any;
  userData: any;
  filteredTrasferedStaff: any;
  paginatedTrasferedStaff: any;
  transfer: {
    [key: string]: any;
    id: string;
    staff_id: string;
    old_branch_id: string;
    new_branch_id: string;
    kpi_total: string;
    period: string;
    old_designation: string;
    new_designation: string;
    deposit_target: string;
    deposit_achieved: string;
    loan_gen_target: string;
    loan_gen_achieved: string;
    loan_amulya_target: string;
    loan_amulya_achieved: string;
    audit_target: string;
    audit_achieved: string;
    recovery_target: string;
    recovery_achieved: string;
    insurance_target: string;
    insurance_achieved: string;
  } = {
    id: '',
    staff_id: '',
    old_branch_id: '',
    new_branch_id: '',
    kpi_total: '',
    period: '',
   
    old_designation: '',
    new_designation: '',
    deposit_target: '',
    deposit_achieved: '',
    loan_gen_target: '',
    loan_gen_achieved: '',
    loan_amulya_target: '',
    loan_amulya_achieved: '',
    audit_target: '',
    audit_achieved: '',
    recovery_target: '',
    recovery_achieved: '',
    insurance_target: '',
    insurance_achieved: '',
  };

  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  branches: any;
  period: any;
  personalTotalWeightageScore = 0;
  branchTotalWeightageScore = 0;
  grandTotalWeightageScore = 0;
  personalTargets: any;
  branchTargets: any;
  staffScores: any;
  selectedUserRole: string = '';
  hostaffScores: any;
  bmScores: any;
  hodScores: any;
  selectedUser: any;
  searchText: string = '';
  filteredUsers: any[] = [];

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService,
    private staffService: StaffService,
    private periodService: PeriodService,
    private performanceService: PerformanceService,
    private hoPerformanceService: HoPerformanceService,
    private branchManagerService: BranchManagerService
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
    });
    // this.transfer.transfer_date = this.formatDate(new Date());
    this.loadTrasferedStaff();
    this.loadUsers();
    this.loadBranches();
  }
  loadUsers() {
    this.adminService.getUsers().subscribe((data: any) => {
      this.userData = data;
      this.filteredUsers = [...this.userData];
      this.onSearch();
    });
  }
  filterUsers() {
    const text = this.searchText.trim().toLowerCase();

    if (!text) {
      this.filteredUsers = [...this.userData];
      this.selectedUser = null;
      return;
    }

    const match = this.userData.find(
      (user: any) => String(user.PF_NO).toLowerCase() === text
    );

    if (match) {
      this.selectedUser = match;
      this.filteredUsers = [match];
      this.onUserSelect(match);
    } else {
      this.filteredUsers = [];
      this.selectedUser = null;
    }
  }

  onUserSelect(user: any) {
    if (user) {
      this.transfer.staff_id = user.id;
      this.selectedUserRole = user.role;
      
      const branch_id = this.branches.find(
        (b: any) => b.name === user.branch_name
      )?.code;
      
      
      this.transfer.old_branch_id = branch_id;
    } else {
      this.transfer.staff_id = '';
      this.selectedUserRole = '';
    }
  }

  loadBranches() {
    this.adminService.getBranches().subscribe((data) => {
      this.branches = data;
    });
  }
  loadTrasferedStaff() {
    this.adminService.getTrasferedStaff().subscribe((data) => {
      this.TrasferedStaff = data;
      this.onSearch();
    });
  }

  onSearch(): void {
    this.filteredTrasferedStaff = this.searchService.filterData(
      this.TrasferedStaff,
      this.searchTerm
    );
    this.totalPages = this.paginationService.getTotalPages(
      this.filteredTrasferedStaff,
      this.pageSize
    );
    this.updatePaginatedTrasferedStaff();
  }

  updatePaginatedTrasferedStaff(): void {
    this.paginatedTrasferedStaff = this.paginationService.getPaginatedData(
      this.filteredTrasferedStaff,
      this.currentPage,
      this.pageSize
    );
  }

  goToPage(event: Event, page: number): void {
    event.preventDefault();
    this.currentPage = page;
    this.updatePaginatedTrasferedStaff();
  }
  formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  saveBranch() {
    const kpis = [
      'deposit',
      'loan_gen',
      'loan_amulya',
      'recovery',
      'audit',
      'insurance',
    ];

    // Call branchstaff AFTER you select or fill the staff fields
    if (this.transfer.staff_id && this.transfer.old_branch_id) {
      const newBranchId = this.transfer.new_branch_id;
      const oldBranchId = this.transfer.old_branch_id;
      const staff_id = this.transfer.staff_id;
      if (this.selectedUserRole === 'Clerk') {
        this.performanceService
          .getStaffScores(
            this.period,
            this.transfer.staff_id,
            this.transfer.old_branch_id
          )
          .subscribe((data: any) => {
            this.staffScores = data;
            console.log;
            this.transfer.kpi_total = this.staffScores.total || 0;
            this.transfer.old_designation = this.selectedUserRole || '';
            this.transfer.period = this.period;

            kpis.forEach((kpi) => {
              const scoreData = this.staffScores?.[kpi];
              if (scoreData) {
                this.transfer[`${kpi}_target`] = scoreData.target || 0;
                this.transfer[`${kpi}_achieved`] = scoreData.achieved || 0;
              } else {
                this.transfer[`${kpi}_target`] = 0;
                this.transfer[`${kpi}_achieved`] = 0;
              }
            });

            this.saveOrUpdateTransfer();
          });
      } else if (this.selectedUserRole === 'HO_STAFF') {
        this.hoPerformanceService
          .getStaffScores(
            this.period,
            this.transfer.staff_id,
            this.transfer.old_branch_id
          )
          .subscribe(
            (data) => {
              this.hostaffScores = data;
              this.transfer.kpi_total = this.hostaffScores.total || 0;

              this.saveOrUpdateTransfer();
              this.deleteHostaffAndTransfer(staff_id, oldBranchId);
            },
            (error: any) => {
              alert(error.error.error);
            }
          );
      } else if (this.selectedUserRole === 'BM') {
        this.performanceService
          .getBmScores(this.period, this.transfer.old_branch_id)
          .subscribe((data: any) => {
            this.bmScores = data;
            this.transfer.kpi_total = this.bmScores.total || 0;
            this.transfer.old_designation = this.selectedUserRole || '';
            this.transfer.period = this.period;
            kpis.forEach((kpi) => {
              const scoreData = this.bmScores?.[kpi];
              if (scoreData) {
                this.transfer[`${kpi}_target`] = scoreData.target || 0;
                this.transfer[`${kpi}_achieved`] = scoreData.achieved || 0;
              } else {
                this.transfer[`${kpi}_target`] = 0;
                this.transfer[`${kpi}_achieved`] = 0;
              }
            });

            this.saveOrUpdateTransfer();
          });
      } else if (this.selectedUserRole === 'HOD') {
        this.hoPerformanceService
          .getHoScores(
            this.period,
            this.transfer.staff_id,
            this.transfer.old_branch_id
          )
          .subscribe((data) => {
            this.hodScores = data;
            this.transfer.kpi_total = this.hodScores.scores?.total || 0;

            this.saveOrUpdateTransfer();
          });
      } else {
        this.transfer.kpi_total = '0';
        this.saveOrUpdateTransfer();
      }
    } else {
      alert('Please select staff and old branch before saving');
    }
  }
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async saveOrUpdateTransfer() {
    const newBranchId = this.transfer.new_branch_id;
    const oldBranchId = this.transfer.old_branch_id;
    const role = this.transfer.new_designation;
    const staff_id = this.transfer.staff_id;
    const confirmed = confirm('Do you want to Transfer the Staff?');
    if (!confirmed) return;

    try {
      // await  this.giveTransferDate(staff_id).toPromise();
     
      // await this.autoDistributeOldBranch(oldBranchId).toPromise();

      if (this.transfer.id) {
        // await this.adminService
        //   .updateTrasferedStaff(this.transfer.id, this.transfer)
        //   .toPromise();

        // await this.delay(5000);
        // if (this.selectedUserRole === 'BM') {
        //   await this.updateEmployee_Trasnfer_table_BM(
        //     staff_id,
        //     this.period,
        //     oldBranchId,
        //     newBranchId

        //   ).toPromise();
        // } else {
        //   await this.updateEmploye_Trasfer_table(
        //     this.period,
        //     oldBranchId,
        //     staff_id
        //   ).toPromise();
        // }
         await this.adminService.transferMasterUpdate({
  staff_id: this.transfer.staff_id,
  period: this.period,
  old_branchId: this.transfer.old_branch_id,
  new_branchId: this.transfer.new_branch_id,
  role: this.selectedUserRole,
  transferData: this.transfer
}).toPromise();
      } else {
        // await this.adminService.addTrasferedStaff(this.transfer).toPromise();
        // await this.delay(3000);
        // if (this.selectedUserRole === 'BM') {
        //   await this.updateEmployee_Trasnfer_table_BM(
        //     staff_id,
        //     this.period
        //     ,oldBranchId, newBranchId
        //   ).toPromise();
        // } else {
        //   await this.updateEmploye_Trasfer_table(
        //     this.period,
        //     oldBranchId,
        //     staff_id
        //   ).toPromise();
        // }
        await this.adminService.transferMaster({
  staff_id: this.transfer.staff_id,
  period: this.period,
  old_branchId: this.transfer.old_branch_id,
  new_branchId: this.transfer.new_branch_id,
  role: this.selectedUserRole,
  transferData: this.transfer
}).toPromise();

console.log("Transfer completed successfully");

       
      }
      
      await this.adminService
        .transferUser(staff_id, newBranchId, role)
        .toPromise();

      this.loadTrasferedStaff();

       if(this.transfer.new_designation==='BM' && this.selectedUserRole==='Clerk'){
          await this.adminService.addClearkToBMTraget( this.period, newBranchId, staff_id).toPromise();
        }
      if(this.transfer.new_designation === 'Clerk'){
          await this.autoDistributeNewBranch(newBranchId).toPromise();
      }

      console.log('Transfer Completed Successfully');

      this.resetTransferForm();
    } catch (err) {
      console.error(err);
    }
  }
  private resetTransferForm() {
    this.transfer = {
      id: '',
      staff_id: '',
      old_branch_id: '',
      new_branch_id: '',
      kpi_total: '',
      period: '',
     
      old_designation: '',
      new_designation: '',
      deposit_target: '',
      deposit_achieved: '',
      loan_gen_target: '',
      loan_gen_achieved: '',
      loan_amulya_target: '',
      loan_amulya_achieved: '',
      audit_target: '',
      audit_achieved: '',
      recovery_target: '',
      recovery_achieved: '',
      insurance_target: '',
      insurance_achieved: '',
    };
  }

  deleteHostaffAndTransfer(ho_staff_id: any, branch_id: any) {
    this.adminService
      .deleteSpecificHoStaff(ho_staff_id, branch_id)
      .subscribe(() => {});
  }

  autoDistributeOldBranch(branchId: string) {
    if (branchId) {
      this.branchManagerService
        .autoDistributeTargetsOldBranch(this.period, branchId)
        .subscribe(() => {
          console.log('Auto distribution done for branch:', branchId);
        });
    }
    return { toPromise: () => Promise.resolve() } as any;
  }
  autoDistributeNewBranch(branchId: string) {
    if (branchId) {
      this.branchManagerService
        .autoDistributeTargetsNewBranch(this.period, branchId)
        .subscribe(() => {
          console.log('Auto distribution done for branch:', branchId);
        });
    }
    return { toPromise: () => Promise.resolve() } as any;
  }
  giveTransferDate(id: any) {
    this.adminService.transferDate(id).subscribe(() => {});
    return { toPromise: () => Promise.resolve() } as any;
  }
  updateEmploye_Trasfer_table(period: any, branchId: any, userId: any) {
    const payload = {
      period: period,
      branchId: branchId,
      userId: userId,
    };
    return this.adminService.updateEmployeeTrasfert(payload);
  }
  updateEmployee_Trasnfer_table_BM(staff_id: any, period: any,old_branchId: any, new_branchId: any) {
    return this.adminService.updateEmployeeTransferBM(staff_id, period, old_branchId,new_branchId);
  }
  editBranch(branch: any) {
    this.transfer = { ...branch };
    console.log(this.transfer);
  }

  deleteBranch(id: string) {
    this.adminService.deleteTrasferedStaff(id).subscribe(() => {
      this.loadTrasferedStaff();
    });
  }

  employeeId = this.transfer.staff_id;
  branchId = this.transfer.old_branch_id;
  branchstaff() {
    this.staffService
      .getMyTargets(this.period, this.employeeId, this.branchId)
      .subscribe((data: any) => {
        this.personalTargets = this.calculateScores(data.personal);
        this.branchTargets = this.calculateScores(data.branch);
        this.calculateTotals();
      });
  }

  calculateScores(targets: any[]): any[] {
    if (!Array.isArray(targets)) {
      return [];
    }
    return targets.map((target) => {
      let outOf10;
      const ratio = target.achieved / target.amount;
      switch (target.kpi) {
        case 'deposit':
        case 'loan_gen':
        case 'loan_amulya':
          if (ratio < 1) {
            outOf10 = ratio * 10;
          } else if (ratio < 1.25) {
            outOf10 = 10;
          } else {
            outOf10 = 12.5;
          }
          break;
        case 'recovery':
        case 'audit':
        case 'insurance':
          if (ratio < 1) {
            outOf10 = ratio * 10;
          } else {
            outOf10 = 12.5;
          }
          break;
        default:
          outOf10 = 0;
      }
      outOf10 = Math.max(0, Math.min(12.5, isNaN(outOf10) ? 0 : outOf10));
      const weightageScore = (outOf10 * target.weightage) / 100;
      return {
        ...target,
        outOf10: outOf10,
        weightageScore: isNaN(weightageScore) ? 0 : weightageScore,
      };
    });
  }

  calculateTotals(): void {
    this.personalTotalWeightageScore =
      this.personalTargets?.reduce(
        (acc: any, target: any) => acc + target.weightageScore,
        0
      ) || 0;
    this.branchTotalWeightageScore =
      this.branchTargets?.reduce(
        (acc: any, target: any) => acc + target.weightageScore,
        0
      ) || 0;
    this.grandTotalWeightageScore =
      this.personalTotalWeightageScore + this.branchTotalWeightageScore;
  }
}
