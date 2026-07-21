import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-validation-messages',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './validation-messages.html',
  styleUrl: './validation-messages.scss',
})
export class ValidationMessages {
  readonly control = input.required<AbstractControl>();
}
