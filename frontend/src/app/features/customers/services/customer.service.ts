import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Customer } from '../models/customer';
import { CreateCustomerRequest } from '../models/create-customer-request';

@Injectable({
  providedIn: 'root'
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
    return this.http.post<Customer>(this.apiUrl, request).pipe(
      tap(() => this.customerChangedSubject.next())
    );
  }
}