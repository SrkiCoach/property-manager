import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard-page/dashboard-page';
import { CustomerPage } from './features/customers/pages/customer-page/customer-page';
import { PropertyPage } from './features/properties/pages/property-page/property-page';

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
  },
  {
    path: 'customers',
    component: CustomerPage,
  },
  {
    path: 'properties',
    component: PropertyPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
