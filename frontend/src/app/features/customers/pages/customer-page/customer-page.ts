import { Component, signal } from '@angular/core';

import { Customer } from '../../models/customer';
import { CustomerForm } from '../../components/customer-form/customer-form';
import { CustomerList } from '../../components/customer-list/customer-list';

@Component({
  selector: 'app-customer-page',
  imports: [CustomerForm, CustomerList],
  templateUrl: './customer-page.html',
  styleUrl: './customer-page.scss',
})
export class CustomerPage {
  selectedCustomer = signal<Customer | null>(null);

  editCustomer(customer: Customer): void {
    console.log('Customer page received:', customer);

    this.selectedCustomer.set(customer);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  clearSelection(): void {
    this.selectedCustomer.set(null);
  }
}
