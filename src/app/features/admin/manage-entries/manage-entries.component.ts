import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';
import { PeriodService } from 'src/app/core/period.service';

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

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService,
    private periodService: PeriodService
  ) {}

  ngOnInit(): void {
    this.getPeriod();
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
    this.adminService.getMonthEntries(this.period).subscribe((response: any) => {
      const data = response as any[];
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.entries = data;
      this.onSearch();
    });
  }

  onSearch(): void {
    this.filteredEntries = this.searchService.filterData(this.entries, this.searchTerm);
    this.totalPages = this.paginationService.getTotalPages(this.filteredEntries, this.pageSize);
    this.updatePaginatedEntries();
    this.updateVisiblePages(); 
  }

  updatePaginatedEntries(): void {
    this.paginatedEntries = this.paginationService.getPaginatedData(
      this.filteredEntries,
      this.currentPage,
      this.pageSize
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
    const startPage = Math.floor((this.currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, this.totalPages);

    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  deleteEntry(id: string) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.adminService.deleteEntries(id).subscribe(() => {
        this.loadEntries();
      });
    }
  }
}
