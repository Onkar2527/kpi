import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeightageIncrementComponent } from './weightage-increment/weightage-increment.component';
import { AttenderKpisComponent } from './attender-kpis/attender-kpis.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'weightage-increment'
  },
  {
    path: 'weightage-increment',
    component: WeightageIncrementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule { }
