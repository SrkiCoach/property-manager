import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

import { PagedResponse } from '../../../shared/models/paged-response';
import { CreatePropertyRequest } from '../models/create-property-request';
import { Property } from '../models/property';
import { UpdatePropertyRequest } from '../models/update-property-request';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = '/api/properties';

  private readonly propertyChangedSubject = new Subject<void>();

  readonly propertyChanged$ = this.propertyChangedSubject.asObservable();

  findPaged(
    page: number,
    size: number,
    sort: string,
    direction: 'asc' | 'desc',
    search: string,
  ): Observable<PagedResponse<Property>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
      .set('direction', direction)
      .set('search', search);

    return this.http.get<PagedResponse<Property>>(`${this.baseUrl}/paged`, { params });
  }

  findById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/${id}`);
  }

  create(request: CreatePropertyRequest): Observable<Property> {
    return this.http
      .post<Property>(this.baseUrl, request)
      .pipe(tap(() => this.propertyChangedSubject.next()));
  }

  update(id: number, request: UpdatePropertyRequest): Observable<Property> {
    return this.http
      .put<Property>(`${this.baseUrl}/${id}`, request)
      .pipe(tap(() => this.propertyChangedSubject.next()));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(tap(() => this.propertyChangedSubject.next()));
  }

}
