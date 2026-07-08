import { Component, OnInit, signal } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';
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
    this.customerService.findAll().subscribe(customers => {
      this.customers.set(customers);
    });
  }
}