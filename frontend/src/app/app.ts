import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { CustomerList } from './features/customers/components/customer-list/customer-list';

interface HealthResponse {
  status: string;
  application: string;
  version: string;
}

@Component({
  selector: 'app-root',
  imports: [TranslatePipe, CustomerList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  health = signal<HealthResponse | null>(null);

constructor(
  private http: HttpClient,
  private translate: TranslateService
) {
  this.translate.addLangs(['en', 'el']);
  this.translate.setFallbackLang('en');
  this.translate.use('en');
}

  ngOnInit(): void {
    this.http.get<HealthResponse>('/api/health')
      .subscribe(response => {
        this.health.set(response);
      });
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}