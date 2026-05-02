import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { AdminService } from 'src/app/features/admin/admin.service';
import { PeriodService } from '../period.service';


declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  step = 1;
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  modal: any;
  toastMessage: string="";
  period: any;

  constructor(
    public auth: AuthService,
    private adminService: AdminService,
    private periodService: PeriodService
  ) { }
  ngOnInit(): void {
     this.periodService.currentPeriod.subscribe((period) => {
      this.period = period;
      
    });
  }

  logout() {
    this.auth.logout();
  }

  
  changePassword() {
    this.step = 1;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.error = '';

    const modalEl = document.getElementById('changePasswordModal');
    this.modal = new bootstrap.Modal(modalEl);
    this.modal.show();
  }

  verifyOldPassword() {
    this.error = '';

     if (!this.oldPassword ) {
      this.showError('Please enter old password');
      return;
    }
    const payload = { userId: this.auth.user?.id, oldPassword: this.oldPassword ,period: this.period};
  
    this.adminService.verifyOldPassword(payload).subscribe({
    next: (res: any) => {
      if (res.ok) {
        this.step = 2;
        this.error = '';
      }
    },
    error: (err) => {
      const msg = err.error?.error || "Old password is incorrect";
      this.showError(msg);
    }
  });
      
  }

  
  updatePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.showError('Please fill all fields');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showError('Passwords do not match');
      return;
    }


    this.adminService.updatePassword(this.auth.user?.id,this.newPassword,this.period).subscribe(() => {
      this.modal.hide();
      this.showError('Password Updated Successfully!');
    });
  }

  showError(message: string) {
   this.toastMessage = message;

  setTimeout(() => {
    this.toastMessage = '';
  }, 3000); 
}
}