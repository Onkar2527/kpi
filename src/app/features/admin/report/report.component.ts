import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { PerformanceService } from '../../performance/performance.service';
import html2pdf from 'html2pdf.js';
import { AllPerformanceService } from '../../all-performnace/all-performance.service';

declare var bootstrap: any;

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportsComponent implements OnInit {
 reportRows= [
  { type: 'BM', name: 'BM Wise Report', pf: null, period: null, department: null },
  { type: 'AGM', name: 'AGM Wise Report', pf: null, period: null, department: null },
  { type: 'AGM_IT', name: 'IT AGM Wise Report', pf: null, period: null, department: null },
  { type: 'AGM_AUDIT', name: 'Audit AGM Wise Report', pf: null, period: null, department: null },
  { type: 'AGM_INSURANCE', name: 'Insurance AGM Wise Report', pf: null, period: null, department: null },
  { type: 'DGM', name: 'DGM Wise Report', pf: null, period: null, department: null },
  { type: 'GM', name: 'GM Wise Report', pf: null, period: null, department: null },
  { type: 'HO', name: 'HO Staff Report', pf: null, period: null, department: null },
  { type: 'STAFF', name: 'Staff Report', pf: null, period: null, department: null },
  { type: 'deputation_staff', name: 'Deputation Staff Report', pf: null, period: null, department: null }
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
  singleHoStaffScore:any;
  singlStaffScore:any;
  deputationStaffList: any[] = [];
  groupedDeputationStaff: { department: string; staff: any[] }[] = [];

  deputationStaffDepartmentList=[
    {id:'1',department:"All" },
    {id:"2",department:"JES School"},
    {id:"3",department:"Jyoti Society"},
    {id:"4",department:"FPO Nippani"},
    {id:"5",department:"Magnum Cinema"},
    {id:"6",department:"OGCS"},
    {id:"7",department:"Indipendent Collage Nippani"},
    {id:"8",department:"PRO & Office Staff List"},
    {id:"9",department:"Staff List"},
    {id:"10",department:"Bhivashi"},
    {id:"11",department:"Bhoopasandra"},
    {id:"12",department:"Jyoti Office"},
    {id:"13",department:"Sun Fan And SOBK"},
    {id:"14",department:"Paver Blocks, Real Estate"},
    {id:"15",department:"Wel Come Hotel"},
    {id:"16",department:"Jyotiba Mandir"},
    {id:"17",department:"Nippani"},
    {id:"18",department:"Jyotirling Khadaklat"},
    {id:"19",department:"Hirasugar Factory Sankeshwar"},
  ]
  constructor(
    private adminService: AdminService,
    private performanceService: PerformanceService,
    private all_performanceService: AllPerformanceService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  openPfPopup(row: any) {
    this.selectedRow = row;
    this.selectedPf = row.pf || '';
    this.selectedPeriod = row.period || '';
    this.selectedDepartment =row.department || '';

    const modal = new bootstrap.Modal(document.getElementById('pfModal'));
    modal.show();
  }
  groupByDepartment(data: any[]) {
  const map: any = {};

  data.forEach(item => {
    if (!map[item.department]) {
      map[item.department] = [];
    }
    map[item.department].push(item);
  });

  this.groupedDeputationStaff = Object.keys(map).map(dept => ({
    department: dept,
    staff: map[dept]
  }));
}

  savePf() {
    if (this.selectedRow) {
      this.selectedRow.pf = this.selectedPf;
      this.selectedRow.period = this.selectedPeriod;
      if (this.selectedRow.type === 'deputation_staff') {
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
    return (
      this.users?.find((u: any) => String(u.PF_NO) === String(pfNo)) || null
    );
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

  generateReport(row: any) {
    this.entredUserData = this.serachBranchID(row.pf);
    if (row.type === 'BM') {
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

      this.AGMDGMFunction(
        'AGM',
        'HO_STAFF',
        this.selectedPeriod,
        this.entredUserData.id
      ).then(([agmRes, staffRes, agmKpis, hoStaffKpis]: any) => {
        this.agmScores = agmRes.kpis;
        this.agmtotal = agmRes.total;
        this.hoStaffScore = staffRes;
        this.agmkpiList = agmKpis.data;
        this.hostaffKpiList = hoStaffKpis.data;

        const modalEl = document.getElementById('agmReportModal');
        if (modalEl) {
          new bootstrap.Modal(modalEl).show();
        }
      });
    } else if (row.type === 'AGM_IT') {
      this.entredUserData = this.serachBranchID(row.pf);

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

      this.all_performanceService
        .getAllAGMScores(this.selectedPeriod)
        .subscribe((data: any) => {
          this.agmScores = data;

          const totalAGMs = data.length;
          const totalWeightage = 100;
          const perAGMWeightage = totalWeightage / totalAGMs;

          this.AGMArray = data.map((agm: any) => ({
            hod_id: agm.hod_id,
            name: agm.name,
            total_score: agm.total,
            weightage: perAGMWeightage,
            weightageScore: (perAGMWeightage * agm.total) / 100,
          }));

          const sum = data.reduce((acc: number, x: any) => acc + x.total, 0);
          this.totalAGMsScore = sum;
          this.gmFinalTotal = this.AGMArray.reduce(
            (acc: number, x: any) => acc + x.weightageScore,
            0
          );
        });

      const modalEl = document.getElementById('gmReportModal');
      if (modalEl) {
        new bootstrap.Modal(modalEl).show();
      }
    } else if (row.type === 'HO') {
      this.entredUserData = this.serachBranchID(row.pf);

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
    }else if (row.type === 'STAFF') {
      this.entredUserData = this.serachBranchID(row.pf);

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
    }else if (row.type === 'deputation_staff') {
      const payload={period:row.period,department:row.department} 
    

        this.adminService.deputationStaffReport(payload).subscribe((data:any)=>{
       this.deputationStaffList = data;
        this.groupByDepartment(data);
        })
      const modalEl = document.getElementById('deputationstaffReportModal');
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

    html2pdf()
      .set({
        margin: 20,
        filename: `${modalId}.pdf`,
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

        pdf.save();

        const instance = bootstrap.Modal.getInstance(modalEl);
        instance?.hide();
      })
      .finally(() => {
        this.isPdfDownloading = false;
      });
  }
}
