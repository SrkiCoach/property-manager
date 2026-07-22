import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ValidationMessages } from '../validation-messages/validation-messages';

@Component({
  selector: 'app-textarea-field',
  standalone: true,
  imports: [
    TranslatePipe,
    ValidationMessages
  ],
  templateUrl: './textarea-field.html',
  styleUrl: './textarea-field.scss'
})
export class TextareaField {

  readonly id = input.required<string>();

  readonly label = input.required<string>();

  readonly control = input.required<AbstractControl>();
}