import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HoService } from '../ho/ho.service';
import { PeriodService } from '../../core/period.service';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
  period!: string;
  file: File | null = null;

  constructor(private hoService: HoService, private periodService: PeriodService) { }

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe(period => this.period = period);
  }

  onFileSelect(event: any) {
    this.file = event.target.files[0];
  }

  upload() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        this.hoService.uploadInsuranceTargetsGlobal(this.period, csvData).subscribe(() => {
          alert('Upload successful');
        });
      };
      reader.readAsText(this.file);
    }
  }
}
