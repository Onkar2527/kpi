import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllocateTargetsComponent } from './allocate-targets/allocate-targets.component';
import { VerifyEntriesComponent } from './verify-entries/verify-entries.component';
import { WeightageIncrementComponent } from '../performance/weightage-increment/weightage-increment.component';
import { BmDashboardComponent } from './bm-dashboard/bm-dashboard.component';
import { AttenderKpisComponent } from '../performance/attender-kpis/attender-kpis.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: BmDashboardComponent
  },
  {
    path: 'allocate-targets',
    component: AllocateTargetsComponent
  },
  {
    path: 'verify-entries',
    component: VerifyEntriesComponent
  },
  {
    path: 'weightage-increment',
    component: WeightageIncrementComponent
  },
  {
    path: 'attender-kpis',
    component:AttenderKpisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchManagerRoutingModule { }
