import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { PerformanceService } from '../../performance/performance.service';
import html2pdf from 'html2pdf.js';
import { AllPerformanceService } from '../../all-performnace/all-performance.service';
import * as XLSX from 'xlsx';

declare var bootstrap: any;

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportsComponent implements OnInit {
  reportRows = [
    {
      type: 'BM',
      name: 'BM Wise Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'AGM',
      name: 'AGM Wise Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'AGM_IT',
      name: 'IT AGM Wise Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'AGM_AUDIT',
      name: 'Audit AGM Wise Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'AGM_INSURANCE',
      name: 'Insurance AGM Wise Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'DGM',
      name: 'DGM Wise Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'GM',
      name: 'GM Wise Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'HO',
      name: 'HO Staff Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'In_charge',
      name: 'In-charge wise Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'all_branch',
      name: 'All Branch at once Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'all_users',
      name: 'All staff  Total Weightage Score Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'STAFF',
      name: 'Staff Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'deputation_staff',
      name: 'Deputation Staff Report',
      pf: null,
      period: null,
      department: null,
    },
    {
      type: 'Department_Wise',
      name: 'Department-Wise Report',
      pf: null,
      period: null,
      department: null,
    },
  ];

  kpiKeys = [
    'deposit',
    'loan_gen',
    'loan_amulya',
    'recovery',
    'audit',
    'insurance',
  ];

  periods = ['2025-26', '2026-27', '2027-28'];
sortAllUsers() {
  this.ALLTotalUser.sort((a: any, b: any) => {
    const roleA = this.roleOrder[a.role] ?? 99;
    const roleB = this.roleOrder[b.role] ?? 99;
    return roleA - roleB;
  });
}
loadingStageText :any;
          loadingPercent :any;
  selectedRow: any = null;
  selectedPf = '';
  selectedPeriod = '';
  selectedDepartment = '';
  users: any = {};
  bmScores: any;
  bmStaffScore: any;
  agmScores: any;
  hoStaffScore: any;
  entredUserData: any;
  agmkpiList: any;
  hostaffKpiList: any;
  agmtotal: any;
  AGMArray: any;
  totalAGMsScore: any;
  gmFinalTotal: any;
  singleHoStaffScore: any;
  singlStaffScore: any;
  deputationStaffList: any[] = [];
  totalBranchesCount: any;
  totalBranches: any;
  ALLtotalBranchesCount: any;
  ALLtotalBranches: any;
  groupedDeputationStaff: { department: string; staff: any[] }[] = [];
  isAllBranchLoading = false;

  branchdepartment = [
    { id: '1', department: 'deposit' },
    { id: '2', department: 'loan_gen' },
    { id: '3', department: 'loan_amulya'},
    { id: '4', department: 'recovery' },
    { id: '5', department: 'audit' },
    { id: '6', department: 'insurance' },
  ];

   deputationStaffDepartmentList = [
    { id: '1', department: 'All' },
    { id: '2', department: 'JES School' },
    { id: '3', department: 'Jyoti Society' },
    { id: '4', department: 'FPO Nippani' },
    { id: '5', department: 'Magnum Cinema' },
    { id: '6', department: 'OGCS' },
    { id: '7', department: 'Indipendent Collage Nippani' },
    { id: '8', department: 'PRO & Office Staff List' },
    { id: '9', department: 'Staff List' },
    { id: '10', department: 'Bhivashi' },
    { id: '11', department: 'Bhoopasandra' },
    { id: '12', department: 'Jyoti Office' },
    { id: '13', department: 'Sun Fan And SOBK' },
    { id: '14', department: 'Paver Blocks, Real Estate' },
    { id: '15', department: 'Wel Come Hotel' },
    { id: '16', department: 'Jyotiba Mandir' },
    { id: '17', department: 'Nippani' },
    { id: '18', department: 'Jyotirling Khadaklat' },
    { id: '19', department: 'Hirasugar Factory Sankeshwar' },
  ];
  ALLtotalUserCount: any;
  ALLTotalUser: any;
  toastMessage: any;
  departmentName: any;
  constructor(
    private adminService: AdminService,
    private performanceService: PerformanceService,
    private all_performanceService: AllPerformanceService
  ) {}

 ngAfterViewInit() {
  const modals = document.querySelectorAll('.modal');

  modals.forEach((modal: any) => {
    const modalId = modal.getAttribute('id');

    if (modalId !== 'pfModal') {
      modal.addEventListener('hidden.bs.modal', () => {
        location.reload();
      });
    }
  });
}



  ngOnInit(): void {
    this.loadUsers();

  }
  isSaveDisabled(): boolean {
    if (!this.selectedPeriod) {
      return true;
    }

    if (
      this.selectedRow?.type === 'all_branch' ||
      this.selectedRow?.type === 'all_users'
    ) {
      return false;
    }

    if (this.selectedRow?.type === 'deputation_staff' || this.selectedRow?.type === 'Department_Wise') {
      return !this.selectedDepartment;
    }

    return !this.selectedPf;
  }

  openPfPopup(row: any) {
    this.selectedRow = row;
    this.selectedPf = row.pf || '';
    this.selectedPeriod = row.period || '';
    this.selectedDepartment = row.department || '';

    const modal = new bootstrap.Modal(document.getElementById('pfModal'));
    modal.show();
  }
  roleOrder: Record<string, number> = {
    GM: 1,
    DGM: 2,
    AGM: 3,
    AGM_AUDIT: 4,
    AGM_INSURANCE: 5,
    AGM_IT: 6,
  };

  groupByDepartment(data: any[]) {
    const map: any = {};

    data.forEach((item) => {
      if (!map[item.department]) {
        map[item.department] = [];
      }
      map[item.department].push(item);
    });

    this.groupedDeputationStaff = Object.keys(map).map((dept) => ({
      department: dept,
      staff: map[dept],
    }));
  }

  savePf() {
    if (this.selectedRow) {
      this.selectedRow.pf = this.selectedPf;
      this.selectedRow.period = this.selectedPeriod;
      if (this.selectedRow.type === 'deputation_staff' || this.selectedRow.type === 'Department_Wise') {
        this.selectedRow.department = this.selectedDepartment;
      }
    }

    const modalEl = document.getElementById('pfModal');
    bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

serachBranchID(pfNo: any) {
  if (!Array.isArray(this.users)) {
    return null;
  }

  return this.users.find(
    (u: any) => String(u.PF_NO) === String(pfNo)
  ) || null;
}


  AGMDGMFunction(
    hodRole: 'AGM' | 'AGM_IT' | 'AGM_AUDIT' | 'AGM_INSURANCE' | 'DGM' | 'GM',
    staffRole: 'HO_STAFF',
    period: string,
    hodId: string
  ) {
    return Promise.all([
      this.all_performanceService
        .getHoScores(period, hodId, hodRole)
        .toPromise(),

      this.all_performanceService
        .getScores(period, hodId, staffRole)
        .toPromise(),

      this.all_performanceService
        .getAllKpiRoleWise({ role: hodRole })
        .toPromise(),

      this.all_performanceService
        .getAllKpiRoleWise({ role: staffRole })
        .toPromise(),
    ]);
  }
isAllUsersLoading = false;
isGMLoading = false;
  generateReport(row: any) {
    this.entredUserData = this.serachBranchID(row.pf);
    if (row.type === 'BM') {
      console.log(this.entredUserData.role);
      
      if(this.entredUserData.role!=='BM'){
        this.showToast('Enter valid PF No Number');
        return;
      }
      this.performanceService
        .getBmScores(this.selectedPeriod, this.entredUserData.branch_id)
        .subscribe((data) => {
          this.bmScores = data;
        });
      this.performanceService
        .getScores(this.selectedPeriod, this.entredUserData.branch_id)
        .subscribe((data: any) => {
          this.bmStaffScore = data;
        });

      const modal = new bootstrap.Modal(
        document.getElementById('bmReportModal')
      );
      modal.show();
    } else if (row.type === 'AGM') {
      this.entredUserData = this.serachBranchID(row.pf);
      
      if(this.entredUserData.role!=='AGM'){
        this.showToast('Enter valid PF No Number');
        return;
      }

      if (!this.entredUserData?.id) {
        console.error('AGM user not found for PF:', row.pf);
        return;
      }

      this.AGMDGMFunction(
        'AGM',
        'HO_STAFF',
        this.selectedPeriod,
        this.entredUserData.id
      )
        .then(([agmRes, staffRes, agmKpis, hoStaffKpis]: any[]) => {
          this.agmScores = agmRes?.kpis;
          this.agmtotal = agmRes?.total ?? 0;
      
          
          this.hoStaffScore = staffRes ;

          this.agmkpiList = agmKpis?.data || [];
          this.hostaffKpiList = hoStaffKpis?.data || [];

      
          const modalEl = document.getElementById('agmReportModal');
          if (modalEl) {
            new bootstrap.Modal(modalEl).show();
          }
        })
        .catch((error) => {
          console.error('AGM/DGM data fetch failed:', error);
        });
    } else if (row.type === 'AGM_IT') {
      this.entredUserData = this.serachBranchID(row.pf);
      if(this.entredUserData.role!=='AGM_IT'){
        this.showToast('Enter valid PF No Number');
        return;
      }

      this.AGMDGMFunction(
        'AGM_IT',
        'HO_STAFF',
        this.selectedPeriod,
        this.entredUserData.id
      ).then(([agmRes, staffRes, agmKpis, hoStaffKpis]: any) => {
        this.agmScores = agmRes.kpis;
        this.agmtotal = agmRes.total;
        this.hoStaffScore = staffRes;
        this.agmkpiList = agmKpis.data;
        this.hostaffKpiList = hoStaffKpis.data;

        const modalEl = document.getElementById('itAgmReportModal');
        if (modalEl) {
          new bootstrap.Modal(modalEl).show();
        }
      });
    } else if (row.type === 'AGM_AUDIT') {
      this.entredUserData = this.serachBranchID(row.pf);
      if(this.entredUserData.role!=='AGM_AUDIT'){
        this.showToast('Enter valid PF No Number');
        return;
      }

      this.AGMDGMFunction(
        'AGM_AUDIT',
        'HO_STAFF',
        this.selectedPeriod,
        this.entredUserData.id
      ).then(([agmRes, staffRes, agmKpis, hoStaffKpis]: any) => {
        this.agmScores = agmRes.kpis;
        this.agmtotal = agmRes.total;
        this.hoStaffScore = staffRes;
        this.agmkpiList = agmKpis.data;
        this.hostaffKpiList = hoStaffKpis.data;

        const modalEl = document.getElementById('auditAgmReportModal');
        if (modalEl) {
          new bootstrap.Modal(modalEl).show();
        }
      });
    } else if (row.type === 'AGM_INSURANCE') {
      this.entredUserData = this.serachBranchID(row.pf);

      this.AGMDGMFunction(
        'AGM_INSURANCE',
        'HO_STAFF',
        this.selectedPeriod,
        this.entredUserData.id
      ).then(([agmRes, staffRes, agmKpis, hoStaffKpis]: any) => {
        this.agmScores = agmRes.kpis;
        this.agmtotal = agmRes.total;
        this.hoStaffScore = staffRes;
        this.agmkpiList = agmKpis.data;
        this.hostaffKpiList = hoStaffKpis.data;

        const modalEl = document.getElementById('inAgmReportModal');
        if (modalEl) {
          new bootstrap.Modal(modalEl).show();
        }
      });
    } else if (row.type === 'DGM') {
      this.entredUserData = this.serachBranchID(row.pf);
      if(this.entredUserData.role!=='DGM'){
        this.showToast('Enter valid PF No Number');
        return;
      }

      this.AGMDGMFunction(
        'DGM',
        'HO_STAFF',
        this.selectedPeriod,
        this.entredUserData.id
      ).then(([agmRes, staffRes, agmKpis, hoStaffKpis]: any) => {
        this.agmScores = agmRes.kpis;
        this.agmtotal = agmRes.total;
        this.hoStaffScore = staffRes;
        this.agmkpiList = agmKpis.data;
        this.hostaffKpiList = hoStaffKpis.data;

        const modalEl = document.getElementById('dgmReportModal');
        if (modalEl) {
          new bootstrap.Modal(modalEl).show();
        }
      });
    } else if (row.type === 'GM') {
      this.entredUserData = this.serachBranchID(row.pf);
      if(this.entredUserData.role!=='GM'){
        this.showToast('Enter valid PF No Number');
        return;
      }

      this.isGMLoading = true;
      this.agmScores = null;
      this.AGMArray = [];
      this.gmFinalTotal = 0;

      this.all_performanceService
        .getAllAGMScores(this.selectedPeriod)
        .subscribe({
          next: (data: any) => {
            this.agmScores = data;

            const totalAGMs = data.length;
            const totalWeightage = 100;
            const perAGMWeightage = totalAGMs ? totalWeightage / totalAGMs : 0;

            this.AGMArray = data.map((agm: any) => ({
              hod_id: agm.hod_id,
              name: agm.name,
              total_score: agm.total,
              weightage: perAGMWeightage,
              weightageScore: (perAGMWeightage * agm.total) / 100,
            }));

            this.totalAGMsScore = data.reduce(
              (acc: number, x: any) => acc + x.total,
              0
            );

            this.gmFinalTotal = this.AGMArray.reduce(
              (acc: number, x: any) => acc + x.weightageScore,
              0
            );

            this.isGMLoading = false;
          },
          error: (err) => {
            console.error('GM report load failed', err);
            this.isGMLoading = false;
          },
        });

      const modalEl = document.getElementById('gmReportModal');
      if (modalEl) {
        new bootstrap.Modal(modalEl).show();
      }
    } else if (row.type === 'HO') {
      this.entredUserData = this.serachBranchID(row.pf);
      if(this.entredUserData.role!=='HO_STAFF'){
        this.showToast('Enter valid PF No Number');
        return;
      }

      this.all_performanceService
        .getSpecificALLScores(
          this.selectedPeriod,
          this.entredUserData.id,
          'HO_STAFF'
        )
        .subscribe((data: any) => {
          this.singleHoStaffScore = data;
        });

      const modalEl = document.getElementById('hoStaffReportModal');
      if (modalEl) {
        new bootstrap.Modal(modalEl).show();
      }
    } else if (row.type === 'In_charge') {
      this.entredUserData = this.serachBranchID(row.pf);
      if(this.entredUserData.role!=='AGM' && this.entredUserData.role!=='DGM' && this.entredUserData.role!=='GM' && this.entredUserData.role!=='AGM_AUDIT' && this.entredUserData.role!=='AGM_IT' && this.entredUserData.role!=='AGM_INSURANCE'){
        this.showToast('Enter valid PF No Number');
        return;
      }

      this.all_performanceService
        .getDashbroadCount(this.entredUserData.id, this.selectedPeriod)
        .subscribe({
          next: (data: any) => {
            this.totalBranches = data.totalBranches;
            this.totalBranchesCount = data.totalBranchesCount;
          },
          error: (err) => {
            console.error(' load failed', err);
            this.totalBranchesCount = 0;
          },
        });
      const modalEl = document.getElementById('inChargeReportModal');
      if (modalEl) {
        new bootstrap.Modal(modalEl).show();
      }
    } else if (row.type === 'all_branch') {

  const data = { period: this.selectedPeriod };

  this.isAllBranchLoading = true; 

  this.adminService.allBranchReport(data).subscribe({
    next: (data: any) => {
      this.ALLtotalBranches = data.totalBranches;
      this.ALLtotalBranchesCount = data.totalBranchesCount;

      this.isAllBranchLoading = false;  
    },
    error: (err) => {
      console.error('load failed', err);
      this.totalBranchesCount = 0;

      this.isAllBranchLoading = false; 
    },
  });
  

  const modalEl = document.getElementById('allBranchReportModal');
  if (modalEl) {
    new bootstrap.Modal(modalEl).show();
  }
}
else if (row.type === 'all_users') {

  const data = { period: this.selectedPeriod };

  this.isAllUsersLoading = true;
  this.ALLTotalUser = [];
  this.loadingPercent = 0;
  this.loadingStageText = 'Loading BM...';

  /* ---------- OPEN MODAL ---------- */
  const modalEl = document.getElementById('allusersReportModal');
  if (modalEl) {
    new bootstrap.Modal(modalEl).show();
  }

  /* ---------- BM ---------- */
  this.adminService.usersBM(data).subscribe({
    next: (r1: any) => {
      this.ALLTotalUser.push(...(r1.users || []));
      this.sortAllUsers();
      this.loadingPercent = 20;
      this.loadingStageText = 'Loading Clerks...';

      /* ---------- CLERK ---------- */
      this.adminService.usersClerk(data).subscribe({
        next: (r2: any) => {
          this.ALLTotalUser.push(...(r2.users || []));
          this.sortAllUsers();
          this.loadingPercent = 40;
          this.loadingStageText = 'Loading HO Staff...';

          /* ---------- HO STAFF ---------- */
          this.adminService.usersHOStaff(data).subscribe({
            next: (r3: any) => {
              this.ALLTotalUser.push(...(r3.users || []));
              this.sortAllUsers();
              this.loadingPercent = 60;
              this.loadingStageText = 'Loading Attenders...';

              /* ---------- ATTENDER ---------- */
              this.adminService.usersAttender(data).subscribe({
                next: (r4: any) => {
                  this.ALLTotalUser.push(...(r4.users || []));
                  this.sortAllUsers();
                  this.loadingPercent = 80;
                  this.loadingStageText = 'Loading AGM & GM...';

                  /* ---------- AGM + GM ---------- */
                  this.adminService.usersAgmGm(data).subscribe({
                    next: (r5: any) => {
                      this.ALLTotalUser.push(...(r5.users || []));
                      this.sortAllUsers();
                      this.loadingPercent = 100;
                      this.isAllUsersLoading = false;
                    },
                    error: (err: any) => {
                      console.error('AGM/GM API failed', err);
                      this.isAllUsersLoading = false;
                    }
                  });
                },
                error: (err: any) => {
                  console.error('Attender API failed', err);
                  this.isAllUsersLoading = false;
                }
              });
            },
            error: (err: any) => {
              console.error('HO Staff API failed', err);
              this.isAllUsersLoading = false;
            }
          });
        },
        error: (err: any) => {
          console.error('Clerk API failed', err);
          this.isAllUsersLoading = false;
        }
      });
    },
    error: (err: any) => {
      console.error('BM API failed', err);
      this.ALLTotalUser = [];
      this.isAllUsersLoading = false;
    }
  });
}


 else if (row.type === 'STAFF') {
      this.entredUserData = this.serachBranchID(row.pf);
      console.log(this.entredUserData);
      
      if(this.entredUserData.role!=='Clerk'){
        this.showToast('Enter valid PF No Number');
        return;
      }

      this.performanceService
        .getStaffScores(
          this.selectedPeriod,
          this.entredUserData.id,
          this.entredUserData.branch_id
        )
        .subscribe((data: any) => {
          this.singlStaffScore = data;
        });

      const modalEl = document.getElementById('staffReportModal');
      if (modalEl) {
        new bootstrap.Modal(modalEl).show();
      }
    } else if (row.type === 'deputation_staff') {
      const payload = { period: row.period, department: row.department };

      this.adminService
        .deputationStaffReport(payload)
        .subscribe((data: any) => {
          this.deputationStaffList = data;
          this.groupByDepartment(data);
        });
      const modalEl = document.getElementById('deputationstaffReportModal');
      if (modalEl) {
        new bootstrap.Modal(modalEl).show();
      }
    } else if (row.type === 'Department_Wise') {

  const data = { period: this.selectedPeriod ,department:this.selectedDepartment};

  this.isAllBranchLoading = true; 

  this.adminService.allSectionWiseReport(data).subscribe({
    next: (data: any) => {
      this.ALLtotalBranches = data.totalBranches;
      this.ALLtotalBranchesCount = data.totalBranchesCount;

      
      this.isAllBranchLoading = false;  
    },
    error: (err) => {
      console.error('load failed', err);
      this.totalBranchesCount = 0;

      this.isAllBranchLoading = false; 
    },
  });
 

  const modalEl = document.getElementById('allDeparmentWiseReportModal');
  if (modalEl) {
    new bootstrap.Modal(modalEl).show();
  }
}

  }
  isPdfDownloading = false;

  downloadPdf(modalId: string) {
    if (this.isPdfDownloading) return;
    this.isPdfDownloading = true;

    const modalEl = document.getElementById(modalId);
    if (!modalEl) {
      this.isPdfDownloading = false;
      return;
    }

    const contentEl = modalEl.querySelector('.modal-body') as HTMLElement;
    if (!contentEl) {
      this.isPdfDownloading = false;
      return;
    }

    const fileName =
      this.entredUserData?.name?.trim() && this.entredUserData?.role?.trim()
        ? `${this.entredUserData.name} ${this.entredUserData.role} report.pdf`
        : `${this.selectedRow.name}.pdf`;

    html2pdf()
      .set({
        margin: 20,
        filename: fileName,
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      } as any)
      .from(contentEl)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        const pages = pdf.internal.getNumberOfPages();
        const w = pdf.internal.pageSize.getWidth();
        const h = pdf.internal.pageSize.getHeight();

        pdf.setFontSize(9);
        for (let i = 1; i <= pages; i++) {
          pdf.setPage(i);
          pdf.text(`Page ${i} of ${pages}`, w / 2, h - 8, { align: 'center' });
        }

        pdf.save(fileName);

        const instance = bootstrap.Modal.getInstance(modalEl);
        instance?.hide();
      })
      .finally(() => {
        this.isPdfDownloading = false;
      });
  }
 
exportExcel() {
  if (!this.ALLTotalUser || this.ALLTotalUser.length === 0) return;

  const workbook: XLSX.WorkBook = XLSX.utils.book_new();

 
  const combinedRoles = ['GM', 'AGM', 'DGM','AGM_IT','AGM_AUDIT','AGM_INSURANCE'];
  const combinedData: any[] = [];


  const grouped: { [key: string]: any[] } = {};

  this.ALLTotalUser.forEach((u: any) => {
    if (combinedRoles.includes(u.role)) {
      combinedData.push(u);
    } else {
      if (!grouped[u.role]) grouped[u.role] = [];
      grouped[u.role].push(u);
    }
  });

 
  if (combinedData.length > 0) {
    const data = combinedData.map((u: any, index: number) => ({
      'Sr. No': index + 1,
      'EMP Code': u.username,
      'Name': u.name,
      'Designation': u.role,
      'Branch Name': u.branch_name,
      'Total Weightage Score': Number(u.bmTotalScore || 0).toFixed(2)
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 15 },
      { wch: 22 },
      { wch: 18 },
      { wch: 25 },
      { wch: 22 }
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Senior_Management' 
    );
  }

 
  Object.keys(grouped).forEach((role) => {
    const data = grouped[role].map((u: any, index: number) => ({
      'Sr. No': index + 1,
      'EMP Code': u.username,
      'Name': u.name,
      'Designation': u.role,
      'Branch Name': u.branch_name,
      'Total Weightage Score': Number(u.bmTotalScore || 0).toFixed(2)
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 15 },
      { wch: 22 },
      { wch: 18 },
      { wch: 25 },
      { wch: 22 }
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      role.substring(0, 31)
    );
  });

  XLSX.writeFile(
    workbook,
    `All_Users_Custom_Role_Wise_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`
  );
}
exportAllReportsExcel() {

  const workbook = XLSX.utils.book_new();

  /* -------- BM SUMMARY SHEET -------- */
  if (this.bmScores && typeof this.bmScores === 'object') {

    const summaryRows = Object.keys(this.bmScores)
      .filter(k => k !== 'total')
      .map((kpi: any) => ({
        KPI: kpi.toUpperCase(),
        Target: this.bmScores[kpi].target,
        Achieved: this.bmScores[kpi].achieved,
        Weightage: this.bmScores[kpi].weightage,
        Score: this.bmScores[kpi].score,
        WeightageScore: Number(this.bmScores[kpi].weightageScore || 0).toFixed(2)
      }));

    summaryRows.push({
      KPI: 'TOTAL',
      Target: '',
      Achieved: '',
      Weightage: '',
      Score: '',
      WeightageScore: Number(this.bmScores.total || 0).toFixed(2)
    });

    const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'BM Summary');
  }

  /* -------- BM STAFF KPI SHEET -------- */
  const bmSheet = this.exportStaffKpiVertical('BM Staff KPI', this.bmStaffScore);
  if (bmSheet) XLSX.utils.book_append_sheet(workbook, bmSheet, 'BM Staff');

  /* -------- AGM STAFF KPI SHEET -------- */
  const clerkSheet = this.exportStaffKpiVertical('Clerk Staff KPI', this.singlStaffScore);
  if (clerkSheet) XLSX.utils.book_append_sheet(workbook, clerkSheet, 'Clerk Staff');


  /* -------- HO STAFF KPI SHEET (NEW) -------- */
  const hoSheet = this.exportHoStaffExcel('HO Staff KPI', this.hoStaffScore);
  if (hoSheet) XLSX.utils.book_append_sheet(workbook, hoSheet, 'HO Staff');

/* -------- BRANCH DEPARTMENT SHEET -------- */
const branchDeptSheet = this.exportBranchDepartmentVertical(
  `${this.ALLtotalBranches[0].department} Branch Report`,
  this.ALLtotalBranches,
  this.departmentName
);

if (branchDeptSheet) {
  XLSX.utils.book_append_sheet(
    workbook,
    branchDeptSheet,
    `${this.ALLtotalBranches[0].department} Branches`
  );
}


  /* -------- AGM SUMMARY SHEET (NEW) -------- */
  if (this.agmScores) {
     const agmSummaryRows = Object.keys(this.agmScores).map((kpi: string) => ({
      KPI: kpi,
      Achieved: this.agmScores[kpi].achieved,
      Weightage: this.agmScores[kpi].weightage,
      Score: this.agmScores[kpi].score,
      WeightageScore: this.agmScores[kpi].weightageScore
    }));

    agmSummaryRows.push({
      KPI: 'TOTAL',
      Achieved: '',
      Weightage: '',
      Score: '',
      WeightageScore: Number(this.agmScores.total || 0).toFixed(2)
    });

    const agmSummarySheet = XLSX.utils.json_to_sheet(agmSummaryRows);
    XLSX.utils.book_append_sheet(workbook, agmSummarySheet, 'AGM Summary');
  }


  /* -------- DOWNLOAD -------- */
  XLSX.writeFile(workbook, `Vertical_Staff_KPI_${new Date().toISOString().slice(0,10)}.xlsx`);
}




exportStaffKpiVertical(title: string, staffArr: any[]) {

  if (!Array.isArray(staffArr) || staffArr.length === 0) return;

  const rows: any[] = [];
  
  
  staffArr.forEach((staff: any) => {

    rows.push({
      'Staff Name': staff.staffName,
      '': ''
    });

    this.kpiKeys.forEach((kpi: string) => {

      if (!staff[kpi]) return;

      rows.push({
        KPI: kpi.toUpperCase(),
        Target: staff[kpi].target,
        Achieved: staff[kpi].achieved,
        Weightage: staff[kpi].weightage,
        WeightageScore: Number(staff[kpi].weightageScore || 0).toFixed(2)
      });

    });

    rows.push({
      KPI: 'TOTAL',
      WeightageScore: Number(staff.total || 0).toFixed(2)
    });

    rows.push({}); // Blank row after each staff
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  ws['!cols'] = [
    { wch: 10 },
    { wch: 25 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 18 }
  ];

  return ws;
}
exportBranchDepartmentVertical(
  title: string,
  branches: any[],
  departmentName: string
) {

  if (!Array.isArray(branches) || branches.length === 0) return;

  const rows: any[] = [];

  branches.forEach((branch: any, index: number) => {

    rows.push({
      'Sr. No': index + 1,
      'Branch Code': branch.code,
      'Branch Name': branch.name,
      'BM Name': branch.bmName,
      [`${branch.department} Target`]: branch.departmentData?.target ?? 0,
      [`${branch.department} Achieved`]: branch.departmentData?.achieved ?? 0,
      'Total Weightage Score': Number(branch.departmentData?.score || 0).toFixed(2)
    });

  });

  const ws = XLSX.utils.json_to_sheet(rows);

  ws['!cols'] = [
    { wch: 8 },
    { wch: 14 },
    { wch: 22 },
    { wch: 22 },
    { wch: 18 },
    { wch: 20 },
    { wch: 22 }
  ];

  return ws;
}

exportHoStaffExcel(title: string, staffArr: any[]) {

  if (!Array.isArray(staffArr) || !staffArr.length) return;

  const rows: any[] = [];
console.log(staffArr);

  staffArr.forEach((staff: any) => {

    rows.push({
      'Staff ID': staff.staffId,
      'Staff Name': staff.staffName
    });

    Object.keys(staff)
      .filter(k => !['staffId', 'staffName', 'total'].includes(k))
      .forEach((kpi: string) => {

        rows.push({
          KPI: kpi,
          Achieved: staff[kpi]?.achieved ?? '',
          Weightage: staff[kpi]?.weightage ?? '',
          Score: staff[kpi]?.score ?? '',
          WeightageScore: staff[kpi]?.weightageScore ?? ''
        });

      });

    rows.push({
      KPI: 'TOTAL',
      WeightageScore: staff.total
    });

    rows.push({});
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  return ws;
}





showToast(msg: string) {
  this.toastMessage = msg;

  setTimeout(() => {
    this.toastMessage = '';
  }, 3000); 
}

}
