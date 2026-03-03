import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';
import { PeriodService } from 'src/app/core/period.service';
declare var bootstrap: any;
@Component({
  selector: 'app-entries-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-entries.component.html',
  styleUrls: ['./manage-entries.component.scss'],
})
export class manageEntriesComponent implements OnInit {
  entries: any;
  filteredEntries: any;
  paginatedEntries: any;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  visiblePages: number[] = [];
  period: any;
  modal: any;
  toastMessage: string = '';
  entriesData = { id: '', kpi: '', account_no: '', value: '', date: '' };
  loading: boolean = false;
  selectedKpiTypes: string[] = [];
  selectedStatuses: string[] = [];
  selectedPfNumbers: string[] = [];
  selectedBranches: string[] = [];

  uniqueKpiTypes: any[] = [];
  uniqueStatuses: any[] = [];
  uniquePfNumbers: any[] = [];
  uniqueBranches: any[] = [];
  allPfNumbers: string[] = [];
  allBranches: string[] = [];

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService,
    private periodService: PeriodService,
  ) {}

  ngOnInit(): void {
    this.getPeriod();
  }
  editEntries() {
    const kpi = this.entriesData.kpi;
    let accountNo = (this.entriesData.account_no || '').trim();
    this.entriesData.account_no = accountNo;

    const needsAccountValidation = kpi === 'deposit' || kpi === 'loan_gen';

    if (needsAccountValidation) {
      if (!accountNo) {
        this.showToast('Account Number is required');
        return;
      }

      if (!/^\d+$/.test(accountNo)) {
        this.showToast('Account Number must contain only digits');
        return;
      }

      if (accountNo.length !== 14) {
        this.showToast('Account Number must be 14 digits long');
        return;
      }
    }

    this.adminService
      .updateEntries(this.entriesData.id, this.entriesData)
      .subscribe(() => {
        this.loadEntries();
        this.entriesData = {
          id: '',
          kpi: '',
          account_no: '',
          value: '',
          date: '',
        };
        this.showToast('Entry updated successfully!');
        this.modal.hide();
      });
  }

  getPeriod() {
    this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
      if (this.period) {
        this.loadEntries();
      }
    });
  }

  loadEntries() {
    this.loading = true;
    this.adminService
      .getMonthEntries(this.period)
      .subscribe((response: any) => {
        const data = response as any[];
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        this.entries = data;
        this.uniqueKpiTypes = [...new Set(this.entries.map((e: any) => e.kpi))];
        this.uniqueStatuses = [
          ...new Set(this.entries.map((e: any) => e.status)),
        ];
        this.uniquePfNumbers = [
          ...new Set(this.entries.map((e: any) => e.PF_NO)),
        ];
        this.uniqueBranches = [
          ...new Set(this.entries.map((e: any) => e.branchName)),
        ];
        this.allPfNumbers = [...this.uniquePfNumbers];
        this.allBranches = [...this.uniqueBranches];
        this.onSearch();
        this.loading = false;
      });
  }
  applyAdvancedFilters(): void {
    let tempData = [...this.entries];

    if (this.selectedBranches.length > 0) {
      const filteredPf = this.entries
        .filter((e: any) => this.selectedBranches.includes(e.branchName))
        .map((e: any) => e.PF_NO);

      this.uniquePfNumbers = [...new Set(filteredPf)];

      // remove invalid PF selections
      this.selectedPfNumbers = this.selectedPfNumbers.filter((pf) =>
        this.uniquePfNumbers.includes(pf),
      );
    } else {
      // restore full PF list if no branch selected
      this.uniquePfNumbers = [
        ...new Set(this.entries.map((e: any) => e.PF_NO)),
      ];
    }

    if (this.searchTerm) {
      tempData = this.searchService.filterByBranchSearch(
        tempData,
        this.searchTerm,
      );
    }

    if (this.selectedKpiTypes.length > 0) {
      tempData = tempData.filter((e) => this.selectedKpiTypes.includes(e.kpi));
    }

    if (this.selectedStatuses.length > 0) {
      tempData = tempData.filter((e) =>
        this.selectedStatuses.includes(e.status),
      );
    }

    if (this.selectedPfNumbers.length > 0) {
      tempData = tempData.filter((e) =>
        this.selectedPfNumbers.includes(e.PF_NO),
      );
    }

    if (this.selectedBranches.length > 0) {
      tempData = tempData.filter((e) =>
        this.selectedBranches.includes(e.branchName),
      );
    }

    this.filteredEntries = tempData;

    this.totalPages = this.paginationService.getTotalPages(
      this.filteredEntries,
      this.pageSize,
    );

    this.currentPage = 1;
    this.updatePaginatedEntries();
    this.updateVisiblePages();
  }

  toggleSelection(value: string, array: string[]) {
    const index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(value);
    }
    this.applyAdvancedFilters();
  }

  clearAllFilters() {
    // Clear search
    this.searchTerm = '';

    // Clear all dropdown selections
    this.selectedKpiTypes = [];
    this.selectedStatuses = [];
    this.selectedPfNumbers = [];
    this.selectedBranches = [];

    // Reset data
    this.filteredEntries = [...this.entries];

    this.totalPages = this.paginationService.getTotalPages(
      this.filteredEntries,
      this.pageSize,
    );

    this.currentPage = 1;
    this.updatePaginatedEntries();
    this.updateVisiblePages();
  }

  onSearch(): void {
    this.filteredEntries = this.searchService.filterByBranchSearch(
      this.entries,
      this.searchTerm,
    );
    this.totalPages = this.paginationService.getTotalPages(
      this.filteredEntries,
      this.pageSize,
    );
    this.updatePaginatedEntries();
    this.updateVisiblePages();
    this.applyAdvancedFilters();
  }

  updatePaginatedEntries(): void {
    this.paginatedEntries = this.paginationService.getPaginatedData(
      this.filteredEntries,
      this.currentPage,
      this.pageSize,
    );
  }

  goToPage(event: Event, page: number): void {
    event.preventDefault();
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedEntries();
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
  formatDate(dateString: string) {
    const d = new Date(dateString);
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }

  editEntry(entry: any) {
    entry.date = this.formatDate(entry.date);

    this.entriesData = { ...entry };
    const modalEl = document.getElementById('editEntriesModal');
    this.modal = new bootstrap.Modal(modalEl);
    this.modal.show();
  }
  deleteEntry(id: string) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.adminService.deleteEntries(id).subscribe(() => {
        this.loadEntries();
      });
    }
  }

  showToast(msg: string) {
    this.toastMessage = msg;

    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}
