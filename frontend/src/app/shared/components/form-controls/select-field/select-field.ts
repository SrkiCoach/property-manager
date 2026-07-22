import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ValidationMessages } from '../validation-messages/validation-messages';

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [
    TranslatePipe,
    ValidationMessages
  ],
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss'
})
export class SelectField {

  readonly id = input.required<string>();

  readonly label = input.required<string>();

  readonly control = input.required<AbstractControl>();
}