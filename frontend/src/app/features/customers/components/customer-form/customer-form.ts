import { Component, effect, HostListener, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

import { Customer } from '../../models/customer';
import { UpdateCustomerRequest } from '../../models/update-customer-request';

import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../../../shared/models/api-error-response';

type CustomerField = 'firstName' | 'lastName' | 'email' | 'phone';

@Component({
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule, TranslatePipe, ButtonModule, CardModule, InputTextModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss',
})
export class CustomerForm {
  customerForm;

  customer = input<Customer | null>(null);

  saved = output<void>();
  cancelled = output<void>();

  submitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private messageService: MessageService,
    private translate: TranslateService,
  ) {
    this.customerForm = this.fb.nonNullable.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(30)]],
    });

    effect(() => {
      const customer = this.customer();

      if (customer) {
        this.customerForm.setValue({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email ?? '',
          phone: customer.phone ?? '',
        });
      } else {
        this.customerForm.reset();
      }
    });
  }

  save(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const currentCustomer = this.customer();
    const request = this.customerForm.getRawValue();

    this.submitting.set(true);
    this.customerForm.disable();

    const operation$ = currentCustomer
      ? this.customerService.update(currentCustomer.id, request)
      : this.customerService.create(request);

    operation$.subscribe({
      next: () => {
        this.customerForm.enable();
        this.submitting.set(false);
        this.customerForm.reset();

        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('MESSAGES.SUCCESS'),
          detail: this.translate.instant(
            currentCustomer ? 'CUSTOMERS.UPDATED_SUCCESSFULLY' : 'CUSTOMERS.SAVED_SUCCESSFULLY',
          ),
        });

        this.saved.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.customerForm.enable();
        this.submitting.set(false);

        const apiError = error.error as ApiErrorResponse | null;

        if (error.status === 400 && apiError?.code === 'VALIDATION_FAILED') {
          this.applyServerValidationErrors(apiError.fieldErrors);

          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('MESSAGES.ERROR'),
            detail: this.translate.instant('VALIDATION.FORM_INVALID'),
          });

          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('MESSAGES.ERROR'),
          detail: this.translate.instant(
            currentCustomer ? 'CUSTOMERS.UPDATE_FAILED' : 'CUSTOMERS.SAVE_FAILED',
          ),
        });
      },
    });
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.customer() && !this.submitting()) {
      this.cancel();
    }
  }

  cancel(): void {
    this.customerForm.reset();
    this.cancelled.emit();
  }

  private applyServerValidationErrors(fieldErrors: Record<string, string>): void {
    for (const fieldName of Object.keys(fieldErrors)) {
      if (this.isCustomerField(fieldName)) {
        const control = this.customerForm.controls[fieldName];

        control.setErrors({
          ...control.errors,
          server: true,
        });

        control.markAsTouched();
      }
    }
  }

  private isCustomerField(fieldName: string): fieldName is CustomerField {
    return ['firstName', 'lastName', 'email', 'phone'].includes(fieldName);
  }

  clearServerError(fieldName: CustomerField): void {
    const control = this.customerForm.controls[fieldName];

    if (!control.hasError('server')) {
      return;
    }

    const errors = { ...control.errors };
    delete errors['server'];

    control.setErrors(Object.keys(errors).length > 0 ? errors : null);
  }
}
