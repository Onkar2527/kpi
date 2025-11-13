import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';

@Component({
  selector: 'app-kpi-mapping',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kpi-mapping.component.html',
  styleUrls: ['./kpi-mapping.component.scss'],
})
export class KpiMappingComponent implements OnInit {
  kpiMappingList: any;
  filteredkpiMapping: any;
  paginatedkpiMapping: any;
  kpiMapping = { id: '',role:'',kpi_id: '',weightage:'' };
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  kpiList:any;

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.loadkpiMapping();
    this.loadkpis();
  }

  loadkpiMapping() {
   this.adminService.getKpiMappingList().subscribe((data) => {
      this.kpiMappingList = data;
      this.onSearch();
    });
  }

  loadkpis()
  {
     this.adminService.getKpiList().subscribe((data) => {
      this.kpiList = data;
      this.onSearch();
    });
  }
  onSearch(): void {
    this.filteredkpiMapping = this.searchService.filterData(
      this.kpiMappingList,
      this.searchTerm
    );
    this.totalPages = this.paginationService.getTotalPages(
      this.filteredkpiMapping,
      this.pageSize
    );
    this.updatePaginatedkpiMapping();
  }

  updatePaginatedkpiMapping(): void {
    this.paginatedkpiMapping = this.paginationService.getPaginatedData(
      this.filteredkpiMapping,
      this.currentPage,
      this.pageSize
    );
  }

  goToPage(event: Event, page: number): void {
    event.preventDefault();
    this.currentPage = page;
    this.updatePaginatedkpiMapping();
  }

  savekpiMapping() {
    if (this.kpiMapping.id) {
      this.adminService.updateKpiMapping(this.kpiMapping.id, this.kpiMapping).subscribe(() => {
        this.loadkpiMapping();
      });
    } else {
      this.adminService.addKpiMapping(this.kpiMapping).subscribe(() => {
        this.loadkpiMapping();
      });
    }
    this.kpiMapping = { id: '',role:'',kpi_id: '',weightage:'' };
  }

  editKpiMapping(kpiMapping: any) {
    this.kpiMapping = { ...kpiMapping };
  }

  deleteKpiMapping(id: string) {
    this.adminService.deleteKpiMapping(id).subscribe(() => {
      this.loadkpiMapping();
    });
  }
}
