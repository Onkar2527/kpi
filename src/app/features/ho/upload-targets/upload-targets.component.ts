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

  uploadType: 'main' | 'branch-specific' | 'dashborad' | 'dashborad-achieved' | 'salary' |
    'recovery-achiveved' | 'insurance-achiveved' | 'audit-achiveved' | 'deputation-staff' | 'insurance-traget' | 'previous-period-data' = 'main';

  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private hoService: HoService,
    private periodService: PeriodService,
    public auth: AuthService
  ) { }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
    }
  }



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
            } else if (role === 'loanAmulya_ho') {
              upload$ = this.hoService.uploadTargets(period, this.file!);
            }
            else if (role === 'HO' || role === 'insurance_ho' || role === 'recovery_ho' || role === 'audit_ho') {

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
                case 'previous-period-data':
                  upload$ = this.hoService.uploadPreviousPeriodData(period, this.file!);
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
                case 'audit-achiveved':
                  upload$ = this.hoService.uploadAuditAchieved(period, this.file!);
                  break;
                case 'insurance-traget':
                  upload$ = this.hoService.uploadInsuranceTargets(period, this.file!);
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
  downloadCSVTemplate() {
    let csvContent = "";
    let fileName = "";

    switch (this.uploadType) {
      case 'main':
      case 'previous-period-data':
        csvContent = "period,branch_id,deposit,loan_gen,loan_amulya\n2026-27,1,5000000.00,4000000.00,3000.00\n2026-27,2,6500000.00,4500000.00,4000.00\n";
        fileName = this.uploadType === 'main' ? "main_targets_sample.csv" : "previous_period_data_sample.csv";
        break;
      case 'branch-specific':
        csvContent = "period,branch_id,recovery\n2026-27,1,200000.00\n2026-27,2,300000.00\n";
        fileName = "recovery_targets_sample.csv";
        break;
      case 'dashborad':
        csvContent = "period,branch_id,balance_deposit,loan_gen,loan_amulya\n2026-27,1,5000000.00,4000000.00,20.00\n2026-27,2,6500000.00,4500000.00,30.00\n";
        fileName = "dashboard_new_year_data_sample.csv";
        break;
      case 'salary':
        csvContent = "period,pf_no,branch_id,salary,increment\n2025-26,101,1,50000.00,5000.00\n2025-26,102,2,60000.00,6000.00\n";
        fileName = "salary_data_sample.csv";
        break;
      case 'deputation-staff':
        csvContent = "emp_id,name,place,design,branch,work_at,weightage_score,department,period\n101,John Doe,City,Staff,Branch A,Workplace A,85,Sales,2025-26\n";
        fileName = "deputation_staff_sample.csv";
        break;
      case 'insurance-traget':
        csvContent = "PF_NO,insurance,period\n101,15000.00,2025-26\n102,20000.00,2025-26\n";
        fileName = "insurance_targets_sample.csv";
        break;
      case 'insurance-achiveved':
        csvContent = "period,pf_no,insurance\n2025-26,101,12000.00\n2025-26,102,18000.00\n";
        fileName = "insurance_achieved_sample.csv";
        break;
      case 'recovery-achiveved':
        csvContent = "period,branch_id,recovery_amount\n2025-26,1,350000.00\n2025-26,2,400000.00\n";
        fileName = "recovery_achieved_sample.csv";
        break;
      case 'audit-achiveved':
        csvContent = "period,branch_id,audit_amount\n2025-26,1,85\n2025-26,2,90\n";
        fileName = "audit_achieved_sample.csv";
        break;
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
