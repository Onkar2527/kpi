import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchManagerService } from '../branch-manager.service';
import { AuthService } from '../../../auth.service';
import { SharedService } from '../../../core/shared.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';
import { PeriodService } from '../../../core/period.service';

@Component({
  selector: 'app-verify-entries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-entries.component.html',
  styleUrls: ['./verify-entries.component.css']
})
export class VerifyEntriesComponent implements OnInit {
  period!: string;
  branchId = this.auth.user?.branchId;
  entries: any[] = [];
  filteredEntries: any[] = [];
  paginatedEntries: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  visiblePages: number[] = [];
  pendingEntries = 0;
  verifiedEntries = 0;

  constructor(
    private branchManagerService: BranchManagerService,
    private auth: AuthService,
    private sharedService: SharedService,
    public searchService: SearchService,
    public paginationService: PaginationService,
    private periodService: PeriodService
  ) { }

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe(period => {
      this.period = period;
      this.loadPendingEntries();
    });
  }

  
loadPendingEntries() {
  if (this.branchId) {
    this.branchManagerService.getEntries(this.period, this.branchId).subscribe(data => {
      
    data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.entries = data;
      this.filteredEntries = data;
      this.pendingEntries = data.filter(e => e.status === 'Pending').length;
      this.verifiedEntries = data.filter(e => e.status === 'Verified').length;
      this.updatePagination();
      this.updateVisiblePages();
    });
  }
}

  updatePagination() {
    this.totalPages = this.paginationService.getTotalPages(this.filteredEntries, this.pageSize);
    this.paginatedEntries = this.paginationService.getPaginatedData(this.filteredEntries, this.currentPage, this.pageSize);
  }
   goToPage(event: Event, page: number): void {
    event.preventDefault();
    if (page < 1 || page > this.totalPages) return; 
    this.currentPage = page;
    this.updatePagination();
    this.updateVisiblePages(); 
  }
  onSearch(query: string) {
    this.filteredEntries = this.searchService.filterData(this.entries, query);
    this.currentPage = 1;
    this.updatePagination();
    this.updateVisiblePages();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
    this.updateVisiblePages();
  }

  verify(entryId: string) {
    this.branchManagerService.verifyEntry(entryId).subscribe(() => {
      this.loadPendingEntries();
      this.sharedService.notifyEntryVerified();
    });
  }

  return(entryId: string) {
    this.branchManagerService.returnEntry(entryId).subscribe(() => {
      this.loadPendingEntries();
    });
  }

  filterEntries(status: string) {
    if (status === 'All') {
      this.filteredEntries = this.entries;
    } else {
      this.filteredEntries = this.entries.filter(e => e.status === status);
    }
    this.currentPage = 1;
    this.updatePagination();
    this.updateVisiblePages();
  }
   updateVisiblePages(): void {
    const pagesPerGroup = 10;
    const startPage = Math.floor((this.currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, this.totalPages);

    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }
}
