import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTargetsComponent } from './my-targets/my-targets.component';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { MySubmissionsComponent } from './my-submissions/my-submissions.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my-targets'
  },
  {
    path: 'my-targets',
    component: MyTargetsComponent
  },
  {
    path: 'new-entry',
    component: NewEntryComponent
  },
  {
    path: 'my-submissions',
    component: MySubmissionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
