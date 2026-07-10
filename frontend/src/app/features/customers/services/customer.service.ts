import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Customer } from '../models/customer';
import { CreateCustomerRequest } from '../models/create-customer-request';
import { PagedResponse } from '../../../shared/models/paged-response';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly apiUrl = '/api/customers';

  private readonly customerChangedSubject = new Subject<void>();
  customerChanged$ = this.customerChangedSubject.asObservable();

  constructor(private http: HttpClient) {}

  findAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  create(request: CreateCustomerRequest): Observable<Customer> {
    return this.http
      .post<Customer>(this.apiUrl, request)
      .pipe(tap(() => this.customerChangedSubject.next()));
  }

  findPaged(
    page: number,
    size: number,
    sort: string,
    direction: 'asc' | 'desc',
    search: string
  ): Observable<PagedResponse<Customer>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
      .set('direction', direction)
      .set('search', search);

    return this.http.get<PagedResponse<Customer>>(`${this.apiUrl}/paged`, { params });
  }
}
