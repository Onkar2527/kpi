import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { SearchService } from '../../../core/search.service';
import { PaginationService } from '../../../core/pagination.service';

@Component({
  selector: 'app-branch-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-master.component.html',
  styleUrls: ['./branch-master.component.scss']
})
export class BranchMasterComponent implements OnInit {
  branches: any;
  filteredBranches: any;
  paginatedBranches: any;
  branch = { id: '', code: '', name: '',incharge_id:''};
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  AGMS: any;

  constructor(
    private adminService: AdminService,
    private searchService: SearchService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.loadBranches();
    this.adminService.getAGMS().subscribe((data)=>(this.AGMS = data));
  }

  loadBranches() {
    this.adminService.getBranches().subscribe(data => {
      this.branches = data;
      this.onSearch();
    });
  }

  onSearch(): void {
    this.filteredBranches = this.searchService.filterData(this.branches, this.searchTerm);
    this.totalPages = this.paginationService.getTotalPages(this.filteredBranches, this.pageSize);
    this.updatePaginatedBranches();
  }

  updatePaginatedBranches(): void {
    this.paginatedBranches = this.paginationService.getPaginatedData(this.filteredBranches, this.currentPage, this.pageSize);
  }

  goToPage(event: Event, page: number): void {
    event.preventDefault();
    this.currentPage = page;
    this.updatePaginatedBranches();
  }

  saveBranch() {
    if (this.branch.id) {
      this.adminService.updateBranch(this.branch.id, this.branch).subscribe(() => {
        this.loadBranches();
      });
    } else {
      this.adminService.addBranch(this.branch).subscribe(() => {
        this.loadBranches();
      });
    }
    this.branch = { id: '', code: '', name: '',incharge_id:''};
  }

  editBranch(branch: any) {
    this.branch = { ...branch };
  }

  deleteBranch(id: string) {
    this.adminService.deleteBranch(id).subscribe(() => {
      this.loadBranches();
    });
  }
}
