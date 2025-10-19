import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchManagerRoutingModule } from './branch-manager-routing.module';
import { AllocateTargetsComponent } from './allocate-targets/allocate-targets.component';
import { VerifyEntriesComponent } from './verify-entries/verify-entries.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BranchManagerRoutingModule
  ]
})
export class BranchManagerModule { }
