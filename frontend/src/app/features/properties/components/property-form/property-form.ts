import { Component, input, output } from '@angular/core';

import { Property } from '../../models/property';

@Component({
  selector: 'app-property-form',
  imports: [],
  templateUrl: './property-form.html',
  styleUrl: './property-form.scss',
})
export class PropertyForm {
  property = input<Property | null>(null);

  saved = output<void>();
  cancelled = output<void>();
}