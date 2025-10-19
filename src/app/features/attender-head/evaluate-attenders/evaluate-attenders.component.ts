import { Component, OnInit } from '@angular/core';
import { KpisService } from '../../kpis/kpis.service';
import { AttenderHeadService } from '../attender-head.service';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-evaluate-attenders',
  templateUrl: './evaluate-attenders.component.html',
  styleUrls: ['./evaluate-attenders.component.css']
})
export class EvaluateAttendersComponent implements OnInit {
  attenders: any[] = [];
  kpis: any[] = [];
  evaluations: { [key: string]: { [key: number]: number } } = {};

  constructor(
    private kpisService: KpisService,
    private attenderHeadService: AttenderHeadService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAttenders();
    this.loadKpis();
  }

  loadAttenders(): void {
    const user = this.authService.user;
    if (user && user.branchId) {
      this.attenderHeadService.getAttendersByBranch(user.branchId).subscribe(
        (data: any[]) => {
          this.attenders = data;
          // Initialize evaluations object for each attender
          this.attenders.forEach(attender => {
            this.evaluations[attender.id] = {};
          });
        },
        (error: any) => {
          console.error('Error fetching attenders', error);
        }
      );
    }
  }

  loadKpis(): void {
    this.kpisService.getKpisForRole('attender').subscribe(
      data => {
        this.kpis = data.filter(kpi => kpi.kpi_type === 'manual');
      },
      error => {
        console.error('Error fetching KPIs', error);
      }
    );
  }

  submitEvaluations(): void {
    const user = this.authService.user;
    if (user) {
      const period = new Date().toISOString().slice(0, 7); // YYYY-MM
      for (const attenderId in this.evaluations) {
        for (const kpiId in this.evaluations[attenderId]) {
          const evaluation = {
            period: period,
            userId: attenderId,
            roleKpiId: parseInt(kpiId),
            score: this.evaluations[attenderId][kpiId],
            evaluatorId: user.id
          };
          this.kpisService.submitEvaluation(evaluation).subscribe(
            () => {
              console.log('Evaluation submitted successfully');
            },
            error => {
              console.error('Error submitting evaluation', error);
            }
          );
        }
      }
    }
  }
}
