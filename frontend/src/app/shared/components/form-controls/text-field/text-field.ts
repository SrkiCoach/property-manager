import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ValidationMessages } from '../validation-messages/validation-messages';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [TranslatePipe, ValidationMessages],
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
})
export class TextField {
  readonly id = input.required<string>();

  readonly label = input.required<string>();

  readonly control = input.required<AbstractControl>();
}
