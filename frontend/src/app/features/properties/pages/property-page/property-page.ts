import { Component, signal } from '@angular/core';

import { Property } from '../../models/property';
import { PropertyForm } from '../../components/property-form/property-form';
import { PropertyList } from '../../components/property-list/property-list';

@Component({
  selector: 'app-property-page',
  imports: [PropertyForm, PropertyList],
  templateUrl: './property-page.html',
  styleUrl: './property-page.scss',
})
export class PropertyPage {
  selectedProperty = signal<Property | null>(null);

  editProperty(property: Property): void {
    console.log('Property page received:', property);

    this.selectedProperty.set(property);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  clearSelection(): void {
    this.selectedProperty.set(null);
  }
}