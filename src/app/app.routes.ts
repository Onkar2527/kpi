import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthService } from './auth.service';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children:  [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'branch-manager',
        loadChildren: () => import('./features/branch-manager/branch-manager.module').then(m => m.BranchManagerModule)
      },
      {
        path: 'staff',
        loadChildren: () => import('./features/staff/staff.module').then(m => m.StaffModule)
      },
      {
        path: 'attender-head',
        canActivate: [() => inject(AuthService).isAuthenticated()],
        loadChildren: () => import('./features/attender-head/attender-head.module').then(m => m.AttenderHeadModule)
      },
      {
        path: 'performance',
        loadChildren: () => import('./features/performance/performance.module').then(m => m.PerformanceModule)
      },
      {
        path: 'ho',
        loadChildren: () => import('./features/ho/ho.module').then(m => m.HoModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'insurance',
        loadComponent: () => import('./features/insurance/insurance.component').then(m => m.InsuranceComponent)
      },
      // {
      //   path: 'hod_performance',
      //   loadChildren: () => import('./features/hod_performance/hod_performance.module').then(m => m.HOPerformanceModule)
      // },
      {
        path: 'all-performnace',
        loadChildren: () => import('./features/all-performnace/all-performance.module').then(m => m.AllPerformanceModule)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
