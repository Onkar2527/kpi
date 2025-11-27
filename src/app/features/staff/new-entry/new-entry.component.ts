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
  typeOfDeposit = '';
  type = '';
  kpiOptions = ['deposit', 'loan_gen', 'loan_amulya'];
  typeOfDepositOptions = ['Individual', 'Combined'];
  typeOptions = ['ADD', 'Remove'];
  accountNo = '';
  value : any;
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
allowOnlyNumbers(event: any) {
  let input = event.target.value;

  
  input = input.replace(/[eE.+-]/g, '');

  input = input.replace(/[^0-9]/g, '');

  if (input.length > 14) {
    input = input.substring(0, 14);
  }

  event.target.value = input;
  this.accountNo = input;
}




isSubmitted = false;
  onSubmit() {
    if (this.isSubmitted) return;
    if(this.accountNo.length < 14 && (this.kpi==="deposit"||this.kpi==="loan_gen") ){
      this.error = 'Account Number must be at least 14 digits long.';
      return;
    }
    if (this.kpi === 'loan_amulya') {
    if (!this.value || !this.typeOfDeposit || !this.type || !this.date) {
      this.error = 'Please fill in all required fields for Loan Amulya.';
      return;
    }
  } else {
    if (!this.kpi || !this.value || !this.typeOfDeposit || !this.type || !this.accountNo || !this.date) {
      this.error = 'Please fill in all required fields.';
      return;
    }
  }

    this.error = null;
    this.isSubmitted = true;
    const entry = {
      period: this.period,
      branchId: this.branchId,
      employeeId: this.employeeId,
      kpi: this.kpi,
      typeOfDeposit: this.typeOfDeposit,
      type: this.type,
      accountNo: this.accountNo,
      value: this.value,
      date: this.date,

    };
    console.log('Submitting entry:', entry);
    this.staffService.submitNewEntry(entry).subscribe({
    next: () => {
      this.sharedService.notifyEntryVerified();
      this.router.navigateByUrl('/staff/my-submissions');
    },
    error: (err) => {
      console.error(err);
      this.error = 'Submission failed. Please try again.';
      this.isSubmitted = false; 
    }
  });
  }
}
