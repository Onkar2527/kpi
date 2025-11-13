import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';

@Component({
  selector: 'app-kpi-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kpi-master.component.html',
  styleUrls: ['./kpi-master.component.scss'],
})
export class KpiMasterComponent implements OnInit {
  kpiList: any;
  filteredKpi: any;
  paginatedKpi: any;
  kpis = { id: '', kpi_name: '' };
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.loadKpis();
  }

  loadKpis() {
    this.adminService.getKpiList().subscribe((data) => {
      this.kpiList = data;
      this.onSearch();
    });
  }

  onSearch(): void {
    this.filteredKpi = this.searchService.filterData(
      this.kpiList,
      this.searchTerm
    );
    this.totalPages = this.paginationService.getTotalPages(
      this.filteredKpi,
      this.pageSize
    );
    this.updatePaginatedKpis();
  }

  updatePaginatedKpis(): void {
    this.paginatedKpi = this.paginationService.getPaginatedData(
      this.filteredKpi,
      this.currentPage,
      this.pageSize
    );
  }

  goToPage(event: Event, page: number): void {
    event.preventDefault();
    this.currentPage = page;
    this.updatePaginatedKpis();
  }

  savekpis() {
    if (this.kpis.id) {
      this.adminService.updateKpi(this.kpis.id, this.kpis).subscribe(() => {
        this.loadKpis();
      });
    } else {
      this.adminService.addKpi(this.kpis).subscribe(() => {
        this.loadKpis();
      });
    }
    this.kpis = { id: '', kpi_name: '' };
  }

  editKpi(kpis: any) {
    this.kpis = { ...kpis };
  }

  deleteKpi(id: string) {
    this.adminService.deleteKpi(id).subscribe(() => {
      this.loadKpis();
    });
  }
}
