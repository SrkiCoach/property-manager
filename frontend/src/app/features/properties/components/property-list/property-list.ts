import { Component, output } from '@angular/core';

import { Property } from '../../models/property';

@Component({
  selector: 'app-property-list',
  imports: [],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
})
export class PropertyList {
  editRequested = output<Property>();
}