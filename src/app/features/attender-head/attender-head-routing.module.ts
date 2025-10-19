import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluateAttendersComponent } from './evaluate-attenders/evaluate-attenders.component';

const routes: Routes = [
  {
    path: 'evaluate',
    component: EvaluateAttendersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttenderHeadRoutingModule { }
