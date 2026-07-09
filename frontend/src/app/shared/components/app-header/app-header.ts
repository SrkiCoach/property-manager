import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss'
})
export class AppHeader {
  @Output() languageChanged = new EventEmitter<string>();

  changeLanguage(language: string): void {
    this.languageChanged.emit(language);
  }
}