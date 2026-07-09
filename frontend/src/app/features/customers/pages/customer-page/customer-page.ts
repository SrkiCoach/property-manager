import { Component } from '@angular/core';
import { CustomerForm } from '../../components/customer-form/customer-form';
import { CustomerList } from '../../components/customer-list/customer-list';

@Component({
  selector: 'app-customer-page',
  imports: [CustomerForm, CustomerList],
  templateUrl: './customer-page.html',
  styleUrl: './customer-page.scss'
})
export class CustomerPage {}