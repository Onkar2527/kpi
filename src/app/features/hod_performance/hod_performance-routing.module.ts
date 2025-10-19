import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeightageHoStaffComponent } from './weightage-HoStaff/weightage-HoStaff.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'weightage-HoStaff'
  },
  {
    path: 'weightage-HoStaff',
    component: WeightageHoStaffComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HOPerformanceRoutingModule { }
