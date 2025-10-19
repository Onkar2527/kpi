import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HoRoutingModule } from './ho-routing.module';
import { UploadTargetsComponent } from './upload-targets/upload-targets.component';


@NgModule({
  declarations: [UploadTargetsComponent],
  imports: [
    CommonModule,
    HoRoutingModule,
    FormsModule
  ]
})
export class HoModule { }
