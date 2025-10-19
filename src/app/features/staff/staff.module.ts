import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { MyTargetsComponent } from './my-targets/my-targets.component';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { MySubmissionsComponent } from './my-submissions/my-submissions.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StaffRoutingModule
  ]
})
export class StaffModule { }
