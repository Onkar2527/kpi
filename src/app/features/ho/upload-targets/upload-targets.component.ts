import { Component } from '@angular/core';
import { HoService } from '../ho.service';
import { PeriodService } from '../../../core/period.service';

@Component({
  selector: 'app-upload-targets',
  templateUrl: './upload-targets.component.html',
  styleUrls: ['./upload-targets.component.scss']
})
export class UploadTargetsComponent {
  file: File | null = null;
  uploadType = 'main'; // 'main' or 'branch-specific'

  constructor(private hoService: HoService, private periodService: PeriodService) { }

message: string = '';
messageType: 'success' | 'error' | '' = '';


onFileChange(event: any) {
  const fileList: FileList = event.target.files;
  if (fileList.length > 0) {
    this.file = fileList[0];
  }
}

onSubmit() {
  if (!this.file) {
    this.message = ' Please select a file to upload.';
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
      const periodIndex = headers.findIndex(header => header.trim() === 'period');

      if (periodIndex !== -1) {
        const period = data[periodIndex].trim();

        this.periodService.changePeriod(period).subscribe(() => {
          const upload$ =
            this.uploadType === 'main'
              ? this.hoService.uploadTargets(period, this.file!)
              : this.hoService.uploadBranchSpecificTargets(period, this.file!);

          upload$.subscribe({
            next: () => {
              this.message =
                this.uploadType === 'main'
                  ? ' Main targets uploaded successfully!'
                  : ' Branch-specific targets uploaded successfully!';
              this.messageType = 'success';
              this.file = null;
            },
            error: () => {
              this.message = ' Error uploading file. Please try again.';
              this.messageType = 'error';
            }
          });
        });
      } else {
        this.message = ' Period column not found in CSV.';
        this.messageType = 'error';
      }
    } else {
      this.message = ' Invalid CSV format.';
      this.messageType = 'error';
    }
  };

  reader.readAsText(this.file);
}

}
