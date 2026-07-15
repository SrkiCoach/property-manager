import { AbstractControl, FormGroup } from '@angular/forms';

export function applyServerFieldErrors(form: FormGroup, fieldErrors: Record<string, string>): void {
  for (const [fieldName, message] of Object.entries(fieldErrors)) {
    const control = form.get(fieldName);

    if (!control) {
      continue;
    }

    control.setErrors({
      ...control.errors,
      server: message,
    });

    control.markAsTouched();
  }
}

export function clearServerFieldError(control: AbstractControl): void {
  if (!control.hasError('server')) {
    return;
  }

  const errors = { ...control.errors };
  delete errors['server'];

  control.setErrors(Object.keys(errors).length > 0 ? errors : null);
}
