import { Component, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-list',
  imports: [TranslatePipe],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss'
})
export class CustomerList implements OnInit {

  customers = signal<Customer[]>([]);

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();

    this.customerService.customerChanged$.subscribe(() => {
      this.loadCustomers();
    });
  }

  private loadCustomers(): void {
    this.customerService.findAll().subscribe(customers => {
      this.customers.set(customers);
    });
  }
}