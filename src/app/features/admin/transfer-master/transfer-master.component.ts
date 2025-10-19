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

@Component({
  selector: 'app-transfer-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-master.component.html',
  styleUrls: ['./transfer-master.component.scss'],
})
export class TransferMasterComponent implements OnInit {
  TrasferedStaff: any;
  userData: any;
  filteredTrasferedStaff: any;
  paginatedTrasferedStaff: any;
  transfer = {
    id: '',
    staff_id: '',
    old_branch_id: '',
    new_branch_id: '',
    kpi_total: '',
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
    this.loadTrasferedStaff();
    this.loadUsers();
    this.loadBranches();
    
  }
onUserSelect(user: any) {
  if (user) {
    this.transfer.staff_id = user.id;      // store staff_id for API
    this.selectedUserRole = user.role;     // store role to use in component
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
  loadUsers() {
    this.adminService.getUsers().subscribe((data) => {
      this.userData = data;
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

  // saveBranch() {
  //   if (this.transfer.id) {
  //     this.transfer.kpi_total = String(this.personalTotalWeightageScore);
  //     this.adminService.updateTrasferedStaff(this.transfer.id, this.transfer).subscribe(() => {
  //       this.branchstaff();
  //       this.loadTrasferedStaff();
  //     });
  //   } else {
  //     this.transfer.kpi_total = String(this.personalTotalWeightageScore);
  //     this.adminService.addTrasferedStaff(this.transfer).subscribe(() => {
  //       this.branchstaff();
  //       this.loadTrasferedStaff();
  //     });
  //   }
  //   this.transfer = {id: '', staff_id: '', old_branch_id: '', new_branch_id: '', kpi_total: '' };
  // }

saveBranch() {
  // Call branchstaff AFTER you select or fill the staff fields
  if (this.transfer.staff_id && this.transfer.old_branch_id) {
    const newBranchId = this.transfer.new_branch_id;
    const oldBranchId = this.transfer.old_branch_id;
    const staff_id = this.transfer.staff_id;
    if (this.selectedUserRole === 'Clerk') {
      this.performanceService
        .getStaffScores(this.period, this.transfer.staff_id)
        .subscribe((data: any) => {
          this.staffScores = data;
          this.transfer.kpi_total = this.staffScores.total || 0;

         
          this.saveOrUpdateTransfer();
           this.autoDistribute(newBranchId);
           this.deleteAllocationsAndTransfer(staff_id);
        });

    } else if (this.selectedUserRole === 'HO_STAFF') {
      this.hoPerformanceService
        .getStaffScores(this.period, this.transfer.staff_id, this.transfer.old_branch_id)
        .subscribe(data => {
          this.hostaffScores = data;
          this.transfer.kpi_total = this.hostaffScores.total || 0;

          this.saveOrUpdateTransfer();
          this.deleteHostaffAndTransfer(staff_id, oldBranchId);
          
        },
        (error:any)=>{
          alert(error.error.error)
        }
        );

    } else if (this.selectedUserRole === 'BM') {
      this.performanceService
        .getBmScores(this.period, this.transfer.old_branch_id)
        .subscribe((data: any) => {
          this.bmScores = data;
          this.transfer.kpi_total = this.bmScores.total || 0;

          this.saveOrUpdateTransfer();
        });

    } else if (this.selectedUserRole === 'HOD') {
      this.hoPerformanceService
        .getHoScores(this.period, this.transfer.staff_id, this.transfer.old_branch_id)
        .subscribe(data => {
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


private saveOrUpdateTransfer() {
  const newBranchId = this.transfer.new_branch_id; 

  if (this.transfer.id) {
    this.adminService.transferUser(this.transfer.staff_id, newBranchId).subscribe(() => {
      
    });
    this.adminService
      .updateTrasferedStaff(this.transfer.id, this.transfer)
      .subscribe(() => {
        alert('Staff transferred successfully');
        this.loadTrasferedStaff();
        this.deleteAllocationsAndTransfer(this.transfer.staff_id);
      });
  } else {
    this.adminService.transferUser(this.transfer.staff_id, newBranchId).subscribe(() => {
      
    });
    this.adminService
      .addTrasferedStaff(this.transfer)
      .subscribe(() => {
        alert('Staff transferred successfully');
        this.loadTrasferedStaff();
      });
  }

  // Reset
  this.transfer = {
    id: '',
    staff_id: '',
    old_branch_id: '',
    new_branch_id: '',
    kpi_total: '',
  };
}

deleteAllocationsAndTransfer(user_id:any) {
  this.adminService.deleteAllocations(user_id).subscribe(() => {

  });
}

deleteHostaffAndTransfer(ho_staff_id: any, branch_id: any) {
  this.adminService.deleteSpecificHoStaff(ho_staff_id, branch_id).subscribe(() => {

  });
}

autoDistribute(branchId: string) {
  if (branchId) {
    this.branchManagerService.autoDistributeTargetsToTransfer(this.period, branchId).subscribe(() => {
      console.log('Auto distribution done for branch:', branchId);
    });
  }
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
