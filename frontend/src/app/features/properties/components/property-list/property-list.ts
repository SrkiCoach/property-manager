import { Component, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { Property } from '../../models/property';
import { PropertyService } from '../../services/property.service';
import { AppNotificationService } from '../../../../core/services/app-notification.service';

@Component({
  selector: 'app-property-list',
  imports: [TranslatePipe, TableModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
})
export class PropertyList implements OnInit, OnDestroy {
  properties = signal<Property[]>([]);
  totalItems = signal(0);
  loading = signal(false);

  searchControl = new FormControl('', { nonNullable: true });

  readonly rows = 5;
  readonly rowsPerPageOptions = [5, 10, 20];

  private currentPage = 0;
  private currentSize = this.rows;
  private currentSort = 'title';
  private currentDirection: 'asc' | 'desc' = 'asc';
  private currentSearch = '';

  private readonly destroy$ = new Subject<void>();

  editRequested = output<Property>();

  constructor(
    private readonly propertyService: PropertyService,
    private readonly confirmationService: ConfirmationService,
    private readonly notificationService: AppNotificationService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.propertyService.propertyChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => {
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

  loadProperties(event: TableLazyLoadEvent): void {
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

  editProperty(property: Property): void {
    this.editRequested.emit(property);
  }

  deleteProperty(property: Property): void {
    this.confirmationService.confirm({
      header: this.translate.instant('PROPERTIES.DELETE_CONFIRM_TITLE'),
      message: this.translate.instant('PROPERTIES.DELETE_CONFIRM_MESSAGE', {
        title: property.title,
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
        this.performDelete(property);
      },
    });
  }

  private performDelete(property: Property): void {
    this.propertyService.delete(property.id).subscribe({
      next: () => {
        this.notificationService.success('PROPERTIES.DELETED_SUCCESSFULLY');
      },

      error: () => {
        this.notificationService.error('PROPERTIES.DELETE_FAILED');
      },
    });
  }

  private loadCurrentPage(): void {
    this.loading.set(true);

    this.propertyService
      .findPaged(
        this.currentPage,
        this.currentSize,
        this.currentSort,
        this.currentDirection,
        this.currentSearch,
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.properties.set(response.items);
          this.totalItems.set(response.totalItems);
        },

        error: (error) => {
          console.error('Could not load properties', error);
          this.properties.set([]);
          this.totalItems.set(0);
          this.notificationService.error('PROPERTIES.LOAD_FAILED');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
