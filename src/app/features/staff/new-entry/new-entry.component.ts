import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../staff.service';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/shared.service';
import { PeriodService } from '../../../core/period.service';

@Component({
  selector: 'app-new-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.css']
})
export class NewEntryComponent implements OnInit {
  period!: string;
  employeeId = this.auth.user?.id;
  branchId = this.auth.user?.branchId;
  kpi = '';
  kpiOptions = ['deposit', 'loan_gen', 'loan_amulya'];
  accountNo = '';
  value = 0;
  date = new Date().toISOString().slice(0, 10);
  minDate: string;
  maxDate: string;
  error: string | null = null;

  constructor(
    private staffService: StaffService,
    private auth: AuthService,
    private router: Router,
    private sharedService: SharedService,
    private periodService: PeriodService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().slice(0, 10);
    this.maxDate = today.toISOString().slice(0, 10);
  }

  ngOnInit(): void {
    this.periodService.currentPeriod.subscribe(period => this.period = period);
  }

  onSubmit() {
    if (!this.kpi || !this.value) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    this.error = null;
    const entry = {
      period: this.period,
      branchId: this.branchId,
      employeeId: this.employeeId,
      kpi: this.kpi,
      accountNo: this.accountNo,
      value: this.value,
      date: this.date
    };
    console.log('Submitting entry:', entry);
    this.staffService.submitNewEntry(entry).subscribe(() => {
      this.sharedService.notifyEntryVerified();
      this.router.navigateByUrl('/staff/my-submissions');
    });
  }
}
