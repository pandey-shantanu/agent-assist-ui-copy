import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { ErrorResponse } from '../interfaces/error-response.model';

@Injectable()
export class ApiAbsoluteService {
  constructor(private http: HttpClient) {}

  private formatErrors(error: any): any {
    return throwError(error as ErrorResponse);
  }

  get(absolutePath: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${absolutePath}`, { responseType: 'json', params }).pipe(catchError(this.formatErrors));
  }

  put(absolutePath: string, body: object = {}): Observable<any> {
    return this.http.put(`${absolutePath}`, JSON.stringify(body)).pipe(catchError(this.formatErrors));
  }

  post(absolutePath: string, body: object = {}, options: object = {}): Observable<any> {
    return this.http.post(`${absolutePath}`, JSON.stringify(body), options).pipe(catchError(this.formatErrors));
  }

  delete(absolutePath): Observable<any> {
    return this.http.delete(`${absolutePath}`).pipe(catchError(this.formatErrors));
  }
}
