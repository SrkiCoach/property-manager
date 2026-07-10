import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule, TranslatePipe, ButtonModule, CardModule, InputTextModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss',
})
export class CustomerForm {
  customerForm;

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
  }

  save(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.customerService.create(this.customerForm.getRawValue()).subscribe({
      next: (customer) => {
        this.customerForm.reset();

        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('MESSAGES.SUCCESS'),
          detail: this.translate.instant('CUSTOMERS.SAVED_SUCCESSFULLY'),
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('MESSAGES.ERROR'),
          detail: this.translate.instant('CUSTOMERS.SAVE_FAILED'),
        });
      },
    });
  }
}
