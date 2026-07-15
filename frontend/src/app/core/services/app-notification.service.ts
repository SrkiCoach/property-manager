import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AppNotificationService {
  constructor(
    private readonly messageService: MessageService,
    private readonly translate: TranslateService
  ) {}

  success(detailKey: string): void {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('MESSAGES.SUCCESS'),
      detail: this.translate.instant(detailKey)
    });
  }

  error(detailKey: string): void {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('MESSAGES.ERROR'),
      detail: this.translate.instant(detailKey)
    });
  }
}