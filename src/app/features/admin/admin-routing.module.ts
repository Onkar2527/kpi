import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchMasterComponent } from './branch-master/branch-master.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { DepartmentMasterComponent } from './department-master/department-master.component';
import { WeightageMasterComponent } from './weightage-master/weightage-master.component';
import { WeightageHoStaffComponent } from '../hod_performance/weightage-HoStaff/weightage-HoStaff.component';
import { TransferMasterComponent } from './transfer-master/transfer-master.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'branch-master'
  },
  {
    path: 'branch-master',
    component: BranchMasterComponent
  },
  {
    path: 'user-master',
    component: UserMasterComponent
  },
  {
    path: 'department-master',
    component: DepartmentMasterComponent
  },
  {
    path: 'weightage-master',
    component: WeightageMasterComponent
  },
   {
    path: 'transfer-master',
    component: TransferMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
