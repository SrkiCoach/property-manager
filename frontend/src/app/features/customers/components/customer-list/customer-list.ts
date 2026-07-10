import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  imports: [
    TranslatePipe,
    TableModule,
    ButtonModule
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss'
})
export class CustomerList implements OnInit, OnDestroy {

  customers = signal<Customer[]>([]);
  totalItems = signal(0);
  loading = signal(false);

  readonly rows = 5;
  readonly rowsPerPageOptions = [5, 10, 20];

  private currentPage = 0;
  private currentSize = this.rows;
  private currentSort = 'lastName';
  private currentDirection: 'asc' | 'desc' = 'asc';

  private readonly destroy$ = new Subject<void>();

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.customerChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadCurrentPage();
      });
  }

  loadCustomers(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? this.rows;

    this.currentPage = Math.floor(first / rows);
    this.currentSize = rows;

    if (typeof event.sortField === 'string') {
      this.currentSort = event.sortField;
    }

    this.currentDirection = event.sortOrder === -1 ? 'desc' : 'asc';

    this.loadCurrentPage();
  }

  editCustomer(customer: Customer): void {
    console.log('Edit customer', customer);
  }

  deleteCustomer(customer: Customer): void {
    console.log('Delete customer', customer);
  }

  private loadCurrentPage(): void {
    this.loading.set(true);

    this.customerService.findPaged(
      this.currentPage,
      this.currentSize,
      this.currentSort,
      this.currentDirection
    ).subscribe({
      next: response => {
        this.customers.set(response.items);
        this.totalItems.set(response.totalItems);
        this.loading.set(false);
      },
      error: error => {
        console.error('Could not load customers', error);
        this.customers.set([]);
        this.totalItems.set(0);
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}