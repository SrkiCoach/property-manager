import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard-page/dashboard-page';
import { CustomerPage } from './features/customers/pages/customer-page/customer-page';

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  },
  {
    path: 'customers',
    component: CustomerPage
  },
  {
    path: '**',
    redirectTo: ''
  }
];