import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-weightage-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weightage-master.component.html',
  styleUrls: ['./weightage-master.component.css']
})
export class WeightageMasterComponent implements OnInit {
  weightages: any;
  newWeightage: any = {};

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadWeightages();
  }

  loadWeightages(): void {
    this.adminService.getWeightages().subscribe((data: any) => {
      this.weightages = data;
    });
  }

  editWeightage(weightage: any): void {
    this.newWeightage = { ...weightage };
  }

  saveWeightage(): void {
    this.adminService.updateWeightage(this.newWeightage).subscribe(() => {
      this.loadWeightages();
      this.newWeightage = {};
    });
  }
}
