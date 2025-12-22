import { Component } from '@angular/core';
import { HoService } from '../ho.service';
import { PeriodService } from '../../../core/period.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-upload-targets',
  templateUrl: './upload-targets.component.html',
  styleUrls: ['./upload-targets.component.scss']
})
export class UploadTargetsComponent {
  file: File | null = null;

  uploadType: 'main' | 'branch-specific' | 'dashborad' | 'dashborad-achieved' |'salary' |'recovery-achiveved' |'insurance-achiveved' |'audit-achiveved' | 'deputation-staff'= 'main'; 

  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  
  constructor(
    private hoService: HoService,
    private periodService: PeriodService,
    public auth: AuthService
  ) {}

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
    }
  }
  

  // onSubmit() {
  //   if (!this.file) {
  //     this.message = 'Please select a file to upload.';
  //     this.messageType = 'error';
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const text = reader.result as string;
  //     const lines = text.split('\n');

  //     if (lines.length > 1) {
  //       const headers = lines[0].split(',');
  //       const data = lines[1].split(',');
  //       const periodIndex = headers.findIndex(header => header.trim() === 'period');

  //       if (periodIndex !== -1) {
  //         const period = data[periodIndex].trim();

  //         this.periodService.changePeriod(period).subscribe(() => {
  //           let upload$;

  //           // choose API call based on selected type
  //           if (this.auth.user?.role==='loan_ho' || this.auth.user?.role==='deposit_ho') {
  //             upload$ = this.hoService.uploadTargets1(period, this.file!);
  //           } else if (this.uploadType === 'main' || this.auth.user?.role==='HO') {
  //             upload$ = this.hoService.uploadTargets(period, this.file!);
  //           }else if (this.uploadType === 'branch-specific') {
  //             upload$ = this.hoService.uploadBranchSpecificTargets(period, this.file!);
  //           } else if (this.uploadType === 'dashborad') {
  //             upload$ = this.hoService.uploadPreviousYearData(period, this.file!);
  //           }else if(this.uploadType === 'dashborad-achieved'){
  //              upload$ = this.hoService.uploadTotalAchievedData(period, this.file!);
  //           }else if(this.uploadType==='salary'){
  //             upload$ = this.hoService.uploadSalary(period, this.file!);
  //           }

  //           upload$?.subscribe({
  //             next: () => {
  //               this.message = `${this.uploadType.charAt(0).toUpperCase() + this.uploadType.slice(1)} targets uploaded successfully!`;
  //               this.messageType = 'success';
  //               this.file = null;
  //             },
  //             error: () => {
  //               this.message = 'Error uploading file. Please try again.';
  //               this.messageType = 'error';
  //             }
  //           });
  //         });
  //       } else {
  //         this.message = 'Period column not found in CSV.';
  //         this.messageType = 'error';
  //       }
  //     } else {
  //       this.message = 'Invalid CSV format.';
  //       this.messageType = 'error';
  //     }
  //   };

  //   reader.readAsText(this.file);
  // }
  onSubmit() {
  if (!this.file) {
    this.message = 'Please select a file to upload.';
    this.messageType = 'error';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result as string;
    const lines = text.split('\n');

    if (lines.length > 1) {
      const headers = lines[0].split(',');
      const data = lines[1].split(',');
      const periodIndex = headers.findIndex(h => h.trim() === 'period');

      if (periodIndex !== -1) {
        const period = data[periodIndex].trim();

        this.periodService.changePeriod(period).subscribe(() => {
          let upload$;

        
          const role = this.auth.user?.role;

          if (role === 'loan_ho' || role === 'deposit_ho') {
            upload$ = this.hoService.uploadTargets1(period, this.file!);
          } else if (role === 'loanAmulya_ho'){
             upload$ = this.hoService.uploadTargets(period, this.file!);
          }
          else if (role === 'HO'|| role === 'insurance_ho' || role === 'recovery_ho' || role === 'audit_ho' ) {
           
            switch (this.uploadType) {
              case 'main':
                upload$ = this.hoService.uploadTargets(period, this.file!);
                break;
              case 'branch-specific':
                upload$ = this.hoService.uploadBranchSpecificTargets(period, this.file!);
                break;
              case 'dashborad':
                upload$ = this.hoService.uploadPreviousYearData(period, this.file!);
                break;
              case 'dashborad-achieved':
                upload$ = this.hoService.uploadTotalAchievedData(period, this.file!);
                break;
              case 'salary':
                upload$ = this.hoService.uploadSalary(period, this.file!);
                break;
              case 'insurance-achiveved':
                upload$ = this.hoService.uploadInsuranceAchieved(period, this.file!);
                break;
              case 'recovery-achiveved':
                upload$ = this.hoService.uploadRecoveryAchieved(period, this.file!);
                break;
               case 'deputation-staff':
                upload$ = this.hoService.uploaddeputationStaff(period, this.file!);
                break;
              default:
                this.message = 'Invalid upload type selected.';
                this.messageType = 'error';
                return;
            }
          } else {
            this.message = 'Unauthorized role.';
            this.messageType = 'error';
            return;
          }

        
          upload$?.subscribe({
            next: () => {
              this.message = `${this.uploadType.replace('-', ' ')} uploaded successfully!`;
              this.messageType = 'success';
              this.file = null;
            },
            error: () => {
              this.message = 'Error uploading file. Please try again.';
              this.messageType = 'error';
            }
          });
        });
      } else {
        this.message = 'Period column not found in CSV.';
        this.messageType = 'error';
      }
    } else {
      this.message = 'Invalid CSV format.';
      this.messageType = 'error';
    }
  };

  reader.readAsText(this.file);
}

}
