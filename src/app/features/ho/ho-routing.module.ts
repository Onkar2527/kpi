import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadTargetsComponent } from './upload-targets/upload-targets.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'upload-targets'
  },
  {
    path: 'upload-targets',
    component: UploadTargetsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HoRoutingModule { }
