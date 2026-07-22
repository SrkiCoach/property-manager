import {
  Component,
  effect,
  HostListener,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { PropertyService } from '../../services/property.service';
import { CustomerService } from '../../../customers/services/customer.service';
import { AppNotificationService } from '../../../../core/services/app-notification.service';

import { Property } from '../../models/property';
import { CustomerLookup } from '../../../customers/models/customer-lookup';
import { ApiErrorResponse } from '../../../../shared/models/api-error-response';

import {
  applyServerFieldErrors,
  clearServerFieldError,
} from '../../../../shared/utils/form-errors.util';

import { TextField } from '../../../../shared/components/form-controls/text-field/text-field';
import { TextareaField } from '../../../../shared/components/form-controls/textarea-field/textarea-field';
import { SelectField } from '../../../../shared/components/form-controls/select-field/select-field';

@Component({
  selector: 'app-property-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    TextField,
    TextareaField,
    SelectField,
  ],
  templateUrl: './property-form.html',
  styleUrl: './property-form.scss',
})
export class PropertyForm {
  propertyForm;

  property = input<Property | null>(null);

  saved = output<void>();
  cancelled = output<void>();

  submitting = signal(false);
  loadingCustomers = signal(false);
  customers = signal<CustomerLookup[]>([]);

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private customerService: CustomerService,
    private notificationService: AppNotificationService,
  ) {
    this.propertyForm = this.fb.nonNullable.group({
      customerId: [0, [Validators.required, Validators.min(1)]],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.maxLength(100)]],
      country: ['', [Validators.maxLength(100)]],
      notes: ['', [Validators.maxLength(1000)]],
    });

    effect(() => {
      const property = this.property();

      /*
       * Παρακολουθούμε μόνο το property input.
       *
       * Οι αλλαγές στη Reactive Form εκτελούνται μέσα σε untracked(),
       * ώστε το effect να μη συνδεθεί κατά λάθος με την κατάσταση
       * των form controls.
       */
      untracked(() => {
        if (property) {
          this.propertyForm.reset({
            customerId: property.customerId,
            title: property.title,
            address: property.address,
            city: property.city ?? '',
            country: property.country ?? '',
            notes: property.notes ?? '',
          });
        } else {
          this.resetForm();
        }
      });
    });

    this.loadCustomers();
  }

  save(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    const currentProperty = this.property();
    const request = this.propertyForm.getRawValue();

    this.submitting.set(true);
    this.propertyForm.disable();

    const operation$ = currentProperty
      ? this.propertyService.update(currentProperty.id, request)
      : this.propertyService.create(request);

    operation$
      .pipe(
        finalize(() => {
          this.propertyForm.enable();
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.notificationService.success(
            currentProperty
              ? 'PROPERTIES.UPDATED_SUCCESSFULLY'
              : 'PROPERTIES.SAVED_SUCCESSFULLY',
          );

          this.saved.emit();

          /*
           * Στο edit το saved event αλλάζει το property σε null,
           * επομένως η φόρμα καθαρίζει μέσω του effect.
           *
           * Στο create το property είναι ήδη null, άρα δεν υπάρχει
           * αλλαγή στο input και καθαρίζουμε τη φόρμα εδώ.
           */
          if (!currentProperty) {
            this.resetForm();
          }
        },

        error: (error: HttpErrorResponse) => {
          this.handleSaveError(error, currentProperty !== null);
        },
      });
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.property() && !this.submitting()) {
      this.cancel();
    }
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  clearServerError(fieldName: keyof typeof this.propertyForm.controls): void {
    clearServerFieldError(this.propertyForm.controls[fieldName]);
  }

  private resetForm(): void {
    this.propertyForm.reset({
      customerId: 0,
      title: '',
      address: '',
      city: '',
      country: '',
      notes: '',
    });
  }

  private loadCustomers(): void {
    this.loadingCustomers.set(true);

    this.customerService
      .findAllForLookup()
      .pipe(finalize(() => this.loadingCustomers.set(false)))
      .subscribe({
        next: (customers) => {
          this.customers.set(customers);
        },

        error: () => {
          this.notificationService.error(
            'PROPERTIES.CUSTOMER_LOOKUP_LOAD_FAILED',
          );
        },
      });
  }

  private handleSaveError(
    error: HttpErrorResponse,
    isEditMode: boolean,
  ): void {
    const apiError = error.error as ApiErrorResponse | null;

    if (
      error.status === 400 &&
      apiError?.code === 'VALIDATION_FAILED'
    ) {
      applyServerFieldErrors(
        this.propertyForm,
        apiError.fieldErrors,
      );

      this.notificationService.error('VALIDATION.FORM_INVALID');

      return;
    }

    this.notificationService.error(
      isEditMode
        ? 'PROPERTIES.UPDATE_FAILED'
        : 'PROPERTIES.SAVE_FAILED',
    );
  }
}