// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AdminService } from '../admin.service';
// import { SearchService } from '../../../core/search.service';
// import { PaginationService } from '../../../core/pagination.service';
// import { BranchManagerService } from '../../branch-manager/branch-manager.service';
// import { PeriodService } from 'src/app/core/period.service';
// import { PerformanceService } from '../../performance/performance.service';
// import { switchMap } from 'rxjs/operators';
// declare var bootstrap: any;
// @Component({
//   selector: 'app-user-master',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './user-master.component.html',
//   styleUrls: ['./user-master.component.scss'],
// })
// export class UserMasterComponent implements OnInit {
//   users: any;
//   filteredUsers: any;
//   paginatedUsers: any;
//   resignedDate: any = "";
//   user = {
//     id: '',
//     username: '',
//     name: '',
//     password: '',
//     PF_NO: '',
//     role: '',
//     branch_id: '',
//     department_id: '',
//     hod_id:''
//   };
//   transfer: {
//     [key: string]: any;
//     id: string;
//     staff_id: string;
//     old_branch_id: string;
//     new_branch_id: string;
//     kpi_total: string;
//     period: string;
//     old_designation: string;
//     new_designation: string;
//     deposit_target: string;
//     deposit_achieved: string;
//     loan_gen_target: string;
//     loan_gen_achieved: string;
//     loan_amulya_target: string;
//     loan_amulya_achieved: string;
//     audit_target: string;
//     audit_achieved: string;
//     recovery_target: string;
//     recovery_achieved: string;
//     insurance_target: string;
//     insurance_achieved: string;
//   } = {
//     id: '',
//     staff_id: '',
//     old_branch_id: '',
//     new_branch_id: '',
//     kpi_total: '',
//     period: '',
//     old_designation: '',
//     new_designation: '',
//     deposit_target: '',
//     deposit_achieved: '',
//     loan_gen_target: '',
//     loan_gen_achieved: '',
//     loan_amulya_target: '',
//     loan_amulya_achieved: '',
//     audit_target: '',
//     audit_achieved: '',
//     recovery_target: '',
//     recovery_achieved: '',
//     insurance_target: '',
//     insurance_achieved: '',
//   };
//   AGMS:any;
//   branches: any;
//   departments: any;
//   searchTerm = '';
//   currentPage = 1;
//   pageSize = 10;
//   totalPages = 0;
//   visiblePages: number[] = [];
//   period: any;
//   branch_id: any;
//   selectedUserRole: any;
//   staffScores: any;
//   user_role: any;

//   constructor(
//     private adminService: AdminService,
//     private searchService: SearchService,
//     private paginationService: PaginationService,
//     private branchManagerService: BranchManagerService,
//     private periodService: PeriodService,
//     private performanceService: PerformanceService
//   ) {}

//   ngOnInit(): void {
//     this.periodService.currentPeriod.subscribe((period) => {
//       this.period = period;
//       this.loadUsers();
//     });

//     this.adminService.getBranches().subscribe((data) => (this.branches = data));
//     this.adminService.getAGMS().subscribe((data)=>(this.AGMS = data));
//     this.adminService
//       .getDepartments()
//       .subscribe((data) => (this.departments = data));
//   }

//   loadUsers() {
//     this.adminService.getUsers().subscribe((data) => {
//       this.users = data;
//       this.onSearch();
//     });
//   }

//   onSearch(): void {
//     this.filteredUsers = this.searchService.filterData(
//       this.users,
//       this.searchTerm
//     );
//     this.totalPages = this.paginationService.getTotalPages(
//       this.filteredUsers,
//       this.pageSize
//     );
//     this.updatePaginatedUsers();
//     this.updateVisiblePages();
//   }

//   updatePaginatedUsers(): void {
//     this.paginatedUsers = this.paginationService.getPaginatedData(
//       this.filteredUsers,
//       this.currentPage,
//       this.pageSize
//     );
//   }

//   goToPage(event: Event, page: number): void {
//     event.preventDefault();
//     this.currentPage = page;
//     this.updatePaginatedUsers();
//     this.updateVisiblePages();
//   }

//   saveUser() {
//     this.branch_id = this.user.branch_id;
//     this.user_role = this.user.role;
//     if (this.user.id) {
//       this.adminService.updateUser(this.user.id, this.user).subscribe(() => {
//         this.loadUsers();
//         if (this.user_role === 'Clerk' || this.user_role === 'BM') {
//           this.autoDistribute(this.branch_id);
//         }
//       });
//     } else {
//       this.adminService.addUser(this.user).subscribe(() => {
//         this.loadUsers();
//         if (this.user_role === 'Clerk' || this.user_role === 'BM') {
//           this.autoDistribute(this.branch_id);
//         }
//       });
//     }
//     this.user = {
//       id: '',
//       username: '',
//       name: '',
//       password: '',
//       PF_NO: '',
//       role: '',
//       branch_id: '',
//       department_id: '',
//       hod_id:''
//     };
//   }
//   autoDistribute(branchId: string) {
//     console.log(branchId);

//     this.branchManagerService
//       .autoDistributeTargetsNewUser(this.period, branchId)
//       .subscribe(() => {
//         console.log('Auto distribution done for branch:', branchId);
//       });
//   }

//   updateVisiblePages(): void {
//     const pagesPerGroup = 10;
//     const startPage =
//       Math.floor((this.currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
//     const endPage = Math.min(startPage + pagesPerGroup - 1, this.totalPages);

//     this.visiblePages = [];
//     for (let i = startPage; i <= endPage; i++) {
//       this.visiblePages.push(i);
//     }
//   }
//   editUser(user: any) {
//     this.user = { ...user };
//   }
//   confirmResign() {
//   if (!this.resignedDate) {
//     alert("Please select a resign date");
//     return;
//   }

//   const user = this.selectedUser;

//   // Close modal
//   const modalEl = document.getElementById('resignModal')!;
//   const modal = bootstrap.Modal.getInstance(modalEl);
//   modal.hide();

//   // Now continue your existing logic
//   this.deleteUser(user);
// }

//   deleteUser(user: any) {
//     let modalElement = document.getElementById('resignModal')!;
//   let modal = new bootstrap.Modal(modalElement);
//   modal.show();
//     let branchId = null;

//     if (user.branch_id) {
//       branchId = user.branch_id;
//     } else if (user.new_branch_id) {
//       branchId = user.new_branch_id;
//     } else if (user.old_branch_id) {
//       branchId = user.old_branch_id;
//     } else if (user.branch_name) {
//       const branch = this.branches.find(
//         (b: any) => b.name === user.branch_name
//       );
//       branchId = branch ? branch.code : null;
//     }

//     console.log('Branch used:', branchId);

//     this.transfer = {
//       ...this.transfer,
//       staff_id: user.id,
//       old_branch_id: branchId,
//       old_designation: user.role,
//     };

//     this.selectedUserRole = user.role;

//     const kpis = [
//       'deposit',
//       'loan_gen',
//       'loan_amulya',
//       'recovery',
//       'audit',
//       'insurance',
//     ];

//     if (this.selectedUserRole === 'Clerk') {
//       this.performanceService
//         .getStaffScores(this.period, user.id, branchId)
//         .subscribe((data: any) => {
//           this.staffScores = data;
//           this.transfer.kpi_total = data.total || 0;
//           this.transfer.period = this.period;

//           kpis.forEach((k) => {
//             this.transfer[`${k}_target`] = data[k]?.target || 0;
//             this.transfer[`${k}_achieved`] = data[k]?.achieved || 0;
//           });

//           this.saveOrUpdateTransfer(user, branchId);
//         });
//     } else if (this.selectedUserRole === 'BM') {
//       this.performanceService
//         .getBmScores(this.period, branchId)
//         .subscribe((data: any) => {
//           this.transfer.kpi_total = data.total || 0;
//           this.transfer.period = this.period;

//           kpis.forEach((k) => {
//             this.transfer[`${k}_target`] = data[k]?.target || 0;
//             this.transfer[`${k}_achieved`] = data[k]?.achieved || 0;
//           });

//           this.saveOrUpdateTransfer(user, branchId);
//         });
//     } else {
//       this.transfer.kpi_total = '0';
//       this.transfer.period = this.period;
//       this.saveOrUpdateTransfer(user, branchId);
//     }
//   }

//   private saveOrUpdateTransfer(user: any, branchId: any) {
//     console.log('Transfer object before save:', this.transfer);

//     const confirmed = confirm('Do you want to delete the Staff?');
//     if (!confirmed) return;

//     this.adminService.addTrasferedStaff(this.transfer).subscribe(() => {
//       this.adminService.deleteUser(user.id,this.resignedDate).subscribe(() => {
//         this.branchManagerService
//           .autoDistributeTargetsTorResign(this.period, branchId)
//           .subscribe(() => {
//             console.log('Auto distribution completed');

//             this.updateEmploye_Trasfer_table(this.period, branchId, user.id);

//             this.loadUsers();

//             this.resetTransfer();
//           });
//       });
//     });
//   }

//   private resetTransfer() {
//     this.transfer = {
//       id: '',
//       staff_id: '',
//       old_branch_id: '',
//       new_branch_id: '',
//       kpi_total: '',
//       period: '',
//       old_designation: '',
//       new_designation: '',
//       deposit_target: '',
//       deposit_achieved: '',
//       loan_gen_target: '',
//       loan_gen_achieved: '',
//       loan_amulya_target: '',
//       loan_amulya_achieved: '',
//       audit_target: '',
//       audit_achieved: '',
//       recovery_target: '',
//       recovery_achieved: '',
//       insurance_target: '',
//       insurance_achieved: '',
//     };
//   }
//   updateEmploye_Trasfer_table(period: any, branchId: any, userId: any) {
//     const payload = {
//       period: period,
//       branchId: branchId,
//       userId: userId,
//     };
//     this.adminService.updateEmployeeTrasfer(payload).subscribe(() => {});
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';
import { BranchManagerService } from '../../branch-manager/branch-manager.service';
import { PeriodService } from 'src/app/core/period.service';
import { PerformanceService } from '../../performance/performance.service';

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

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService,
    private branchManagerService: BranchManagerService,
    private periodService: PeriodService,
    private performanceService: PerformanceService
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

  onSearch(): void {
    this.filteredUsers = this.searchService.filterData(
      this.users,
      this.searchTerm
    );
    this.totalPages = this.paginationService.getTotalPages(
      this.filteredUsers,
      this.pageSize
    );
    this.updatePaginatedUsers();
    this.updateVisiblePages();
  }

  updatePaginatedUsers(): void {
    this.paginatedUsers = this.paginationService.getPaginatedData(
      this.filteredUsers,
      this.currentPage,
      this.pageSize
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
        (b: any) => b.name === user.branch_name
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
    } else {
      this.transfer.kpi_total = '0';
      this.finalResign(user, branchId, resignedDate);
    }
  }

  populateKPIs(data: any, kpis: string[]) {
    this.transfer.kpi_total = data.total || 0;

    kpis.forEach((k) => {
      this.transfer[`${k}_target`] = data[k]?.target || 0;
      this.transfer[`${k}_achieved`] = data[k]?.achieved || 0;
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
