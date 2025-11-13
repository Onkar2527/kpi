import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeightageAllComponent } from './weightage-all/weightage-all.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'weightage-all'
  },
  {
    path: 'weightage-all',
    component: WeightageAllComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllPerformanceRoutingModule { }
