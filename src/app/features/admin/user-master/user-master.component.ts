import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';
import { BranchManagerService } from '../../branch-manager/branch-manager.service';
import { PeriodService } from 'src/app/core/period.service';
import { PerformanceService } from '../../performance/performance.service';
import { AllPerformanceService } from '../../all-performnace/all-performance.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss'],
})
export class UserMasterComponent implements OnInit {
  users: any;
  filteredUsers: any;
  paginatedUsers: any;

  resignedDate: string = '';
  selectedUser: any = null;

  user = {
    id: '',
    username: '',
    name: '',
    password: '',
    PF_NO: '',
    role: '',
    branch_id: '',
    department_id: '',
    hod_id: '',
  };

  transfer: any = {
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
    hod_id: '',
    old_hod_id: '',
    resiged:''
  };

  AGMS: any;
  branches: any;
  departments: any;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  visiblePages: number[] = [];
  period: any;
  branch_id: any;
  selectedUserRole: any;
  staffScores: any;
  user_role: any;
  filteredBranches: any;
  branchSearch: any;
  showDropdown = false;
  hostaffScores: any;
  attenderScores: any;

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService,
    private branchManagerService: BranchManagerService,
    private periodService: PeriodService,
    private performanceService: PerformanceService,
    private allperformanceService: AllPerformanceService,
  ) {}

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
      this.loadUsers();
    });

    this.adminService.getBranches().subscribe((data) => (this.branches = data));
    this.adminService.getAGMS().subscribe((data) => (this.AGMS = data));
    this.adminService
      .getDepartments()
      .subscribe((data) => (this.departments = data));
  }

  loadUsers() {
    this.adminService.getUsers().subscribe((data) => {
      this.users = data;
      this.onSearch();
    });
  }
  filterBranches(event: any) {
    const value = event.target.value.toLowerCase();

    if (value.length === 0) {
      this.filteredBranches = [];
      this.showDropdown = false;
    } else {
      this.filteredBranches = this.branches.filter((branch: any) =>
        branch.name.toLowerCase().includes(value),
      );
      this.showDropdown = true;
    }
  }

  selectBranch(branch: any) {
    this.branchSearch = '';
    this.branchSearch = branch.name;

    this.transfer.new_branch_id = branch.code;
    this.showDropdown = false;
  }
  onSearch(): void {
    this.filteredUsers = this.searchService.filterData(
      this.users,
      this.searchTerm,
    );
    this.totalPages = this.paginationService.getTotalPages(
      this.filteredUsers,
      this.pageSize,
    );
    this.updatePaginatedUsers();
    this.updateVisiblePages();
  }

  updatePaginatedUsers(): void {
    this.paginatedUsers = this.paginationService.getPaginatedData(
      this.filteredUsers,
      this.currentPage,
      this.pageSize,
    );
  }

  goToPage(event: Event, page: number): void {
    event.preventDefault();
    this.currentPage = page;
    this.updatePaginatedUsers();
    this.updateVisiblePages();
  }

  updateVisiblePages(): void {
    const pagesPerGroup = 10;
    const startPage =
      Math.floor((this.currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, this.totalPages);

    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  editUser(user: any) {
    this.user = { ...user };
  }

  saveUser() {
    this.branch_id = this.user.branch_id;
    this.user_role = this.user.role;

    if (this.user.id) {
      this.adminService.updateUser(this.user.id, this.user).subscribe(() => {
        this.loadUsers();
        if (['Clerk', 'BM'].includes(this.user_role)) {
          this.autoDistribute(this.branch_id);
        }
      });
    } else {
      this.adminService.addUser(this.user).subscribe(() => {
        this.loadUsers();
        if (['Clerk', 'BM'].includes(this.user_role)) {
          this.autoDistribute(this.branch_id);
        }
      });
    }

    this.user = {
      id: '',
      username: '',
      name: '',
      password: '',
      PF_NO: '',
      role: '',
      branch_id: '',
      department_id: '',
      hod_id: '',
    };
  }

  autoDistribute(branchId: string) {
    this.branchManagerService
      .autoDistributeTargetsNewUser(this.period, branchId)
      .subscribe(() => {});
  }

  //     RESIGNATION WORKFLOW

  openResignPopup(user: any) {
    this.selectedUser = user;
    this.resignedDate = '';

    const modalEl = document.getElementById('resignModal')!;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  confirmResign() {
    if (!this.resignedDate) {
      alert('Please select a resign date');
      return;
    }

    const modalEl = document.getElementById('resignModal')!;
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    
    
    this.startResignProcess(this.selectedUser, this.resignedDate);
  }

  startResignProcess(user: any, resignedDate: string) {
    let branchId = null;

    if (user.branch_id) branchId = user.branch_id;
    else if (user.new_branch_id) branchId = user.new_branch_id;
    else if (user.old_branch_id) branchId = user.old_branch_id;
    else if (user.branch_name) {
      const branch = this.branches.find(
        (b: any) => b.name === user.branch_name,
      );
      branchId = branch ? branch.code : null;
    }

    this.transfer = {
      ...this.transfer,
      staff_id: user.id,
      old_branch_id: branchId,
      old_designation: user.role,
      period: this.period,
    };

    this.selectedUserRole = user.role;

    const kpis = [
      'deposit',
      'loan_gen',
      'loan_amulya',
      'recovery',
      'audit',
      'insurance',
    ];

    if (this.selectedUserRole === 'Clerk') {
      this.performanceService
        .getStaffScores(this.period, user.id, branchId)
        .subscribe((data: any) => {
          this.populateKPIs(data, kpis);
          this.finalResign(user, branchId, resignedDate);
        });
    } else if (this.selectedUserRole === 'BM') {
      this.performanceService
        .getBmScores(this.period, branchId)
        .subscribe((data: any) => {
          this.populateKPIs(data, kpis);
          this.finalResign(user, branchId, resignedDate);
        });
    } else if (this.selectedUserRole === 'HO_STAFF') {
      this.allperformanceService
        .getSpecificALLScores(
          this.period,
          this.transfer.staff_id,
          this.selectedUserRole,
          user.hod_id,
        )
        .subscribe(
          (data: any) => {
            this.hostaffScores = data;

            const kpi = data || {};

            this.transfer.kpi_total = kpi.total || 0;
            this.transfer.old_designation = this.selectedUserRole || '';
            this.transfer.period = this.period;
            this.transfer.old_hod_id = user.hod_id;
            this.transfer.resiged = 1;
            

            const map: any = {
              'Alloted Work': 'deposit',
              'Discipline & Time Management': 'loan_gen',
              'General Work Performance': 'loan_amulya',
              'Branch Communication': 'audit',
              Insurance: 'insurance',
            };

            Object.keys(map).forEach((key) => {
              const field = map[key];
              const score = kpi[key]?.achieved || 0;

              this.transfer[`${field}_target`] = score;
              this.transfer[`${field}_achieved`] = score;
            });

          if(Number(this.transfer.deposit_achieved !==0) || Number(this.transfer.loan_gen_achieved !==0) || Number(this.transfer.loan_amulya_achieved !==0) || Number(this.transfer.audit_achieved !==0))
           this.finalResignForHoStaff(user, this.transfer, resignedDate);
          },
          (error: any) => {
            alert(error.error.error);
          },
        );
    } else if (this.selectedUserRole === 'Attender') {
      this.performanceService
          .getAttenderScore(
            this.period,
            this.transfer.staff_id,
          )
          .subscribe(
            (data: any) => {
              this.attenderScores = data;
             
              const kpi = data[0]?.kpis || {};

              this.transfer.kpi_total = data[0].total || 0;
              this.transfer.old_designation = this.selectedUserRole || '';
              this.transfer.period = this.period;
              this.transfer.old_hod_id = this.user.hod_id;4
              this.transfer.resiged = 1;

              const map: any = {
                'Cleanliness': 'deposit',
                'Attitude, Behavior & Discipline': 'loan_gen',
              };

              Object.keys(map).forEach((key) => {
                const field = map[key];
                const score = kpi[key]?.achieved || 0;

                this.transfer[`${field}_target`] = score;
                this.transfer[`${field}_achieved`] = score;
              });
              console.log(this.transfer);
              
               if(Number(this.transfer.deposit_achieved !==0) || Number(this.transfer.loan_gen_achieved !==0) )
               this.finalResignForAttender(user, this.transfer, resignedDate);
            },
            (error: any) => {
              alert(error.error.error);
            },
          );
    } else {
      this.transfer.kpi_total = '0';
    }
  }

  populateKPIs(data: any, kpis: string[]) {
    this.transfer.kpi_total = data.total || 0;

    kpis.forEach((k) => {
      this.transfer[`${k}_target`] = data[k]?.target || 0;
      this.transfer[`${k}_achieved`] = data[k]?.achieved || 0;
    });
  }
  finalResignForAttender(user: any, transferData: any, resignDate: string) {
    this.adminService.attenderTransfer({transferData:transferData}).subscribe(() => {
      this.adminService.deleteUser(user.id, resignDate).subscribe(() => {
        this.loadUsers();

        this.resetTransfer();
      });
    });
  }
  finalResignForHoStaff(user: any, transferData: any, resignDate: string) {
    this.adminService.hoStaffTransfer({transferData:transferData}).subscribe(() => {
      this.adminService.deleteUser(user.id, resignDate).subscribe(() => {
        this.loadUsers();

        this.resetTransfer();
      });
    });
  }
  finalResign(user: any, branchId: any, resignDate: string) {
    this.adminService.addTrasferedStaff(this.transfer).subscribe(() => {
      this.adminService.deleteUser(user.id, resignDate).subscribe(() => {
        this.branchManagerService
          .autoDistributeTargetsTorResign(this.period, branchId)
          .subscribe(() => {
            this.updateEmploye_Trasfer_table(this.period, branchId, user.id);

            this.loadUsers();

            this.resetTransfer();
          });
      });
    });
  }

  resetTransfer() {
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
      hod_id: '',
      old_hod_id: '',
      resiged:''
    };
  }

  updateEmploye_Trasfer_table(period: any, branchId: any, userId: any) {
    const payload = {
      period: period,
      branchId: branchId,
      userId: userId,
    };
    this.adminService.updateEmployeeTrasfer(payload).subscribe(() => {});
  }
}
