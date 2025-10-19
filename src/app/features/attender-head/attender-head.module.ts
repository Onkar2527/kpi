import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EvaluateAttendersComponent } from './evaluate-attenders/evaluate-attenders.component';
import { AttenderHeadRoutingModule } from './attender-head-routing.module';

@NgModule({
  declarations: [
    EvaluateAttendersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AttenderHeadRoutingModule
  ]
})
export class AttenderHeadModule { }
