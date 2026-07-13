import { Component, OnDestroy, OnInit, output, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';

import { ConfirmationService, MessageService } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-list',
  imports: [TranslatePipe, TableModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList implements OnInit, OnDestroy {
  customers = signal<Customer[]>([]);
  totalItems = signal(0);
  loading = signal(false);

  searchControl = new FormControl('', { nonNullable: true });
  private currentSearch = '';

  readonly rows = 5;
  readonly rowsPerPageOptions = [5, 10, 20];

  private currentPage = 0;
  private currentSize = this.rows;
  private currentSort = 'lastName';
  private currentDirection: 'asc' | 'desc' = 'asc';

  private readonly destroy$ = new Subject<void>();

  editRequested = output<Customer>();

  constructor(
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.customerService.customerChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadCurrentPage();
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => {
        this.currentSearch = search.trim();
        this.currentPage = 0;
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
    console.log('Edit requested:', customer);
    this.editRequested.emit(customer);
  }

  deleteCustomer(customer: Customer): void {
    this.confirmationService.confirm({
      header: this.translate.instant('CUSTOMERS.DELETE_CONFIRM_TITLE'),
      message: this.translate.instant('CUSTOMERS.DELETE_CONFIRM_MESSAGE', {
        name: `${customer.firstName} ${customer.lastName}`,
      }),
      icon: 'pi pi-exclamation-triangle',

      acceptLabel: this.translate.instant('COMMON.DELETE'),
      rejectLabel: this.translate.instant('COMMON.CANCEL'),

      acceptButtonProps: {
        severity: 'danger',
      },

      rejectButtonProps: {
        severity: 'secondary',
        outlined: true,
      },

      accept: () => {
        this.performDelete(customer);
      },
    });
  }

  private performDelete(customer: Customer): void {
    this.customerService.delete(customer.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('MESSAGES.SUCCESS'),
          detail: this.translate.instant('CUSTOMERS.DELETED_SUCCESSFULLY'),
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('MESSAGES.ERROR'),
          detail: this.translate.instant('CUSTOMERS.DELETE_FAILED'),
        });
      },
    });
  }

  private loadCurrentPage(): void {
    this.loading.set(true);

    this.customerService
      .findPaged(
        this.currentPage,
        this.currentSize,
        this.currentSort,
        this.currentDirection,
        this.currentSearch,
      )
      .subscribe({
        next: (response) => {
          this.customers.set(response.items);
          this.totalItems.set(response.totalItems);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Could not load customers', error);
          this.customers.set([]);
          this.totalItems.set(0);
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
