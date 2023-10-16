import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_BASE_URL = 'http://localhost:8000/api'; // process.env['API_BASE_URL'];

  constructor(private httpClient: HttpClient) {}

  get token(): string | null {
    return sessionStorage.getItem('api_token');
  }
  set token(value: string) {
    sessionStorage.setItem('api_token', value);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      window.location.href = '/login';
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.

    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  public get(url: string, params?: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return this.httpClient
      .get(`${this.API_BASE_URL}${url}`, {
        headers,
        params,
      })
      .pipe(catchError(this.handleError));
  }

  public put(url: string, body?: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return this.httpClient.put(`${this.API_BASE_URL}${url}`, body, {
      headers,
    });
  }

  public post(url: string, body?: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return this.httpClient.post(`${this.API_BASE_URL}${url}`, body, {
      headers,
    });
  }

  public delete(url: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return this.httpClient.delete(`${this.API_BASE_URL}${url}`, {
      headers,
    });
  }

  public setToken(value?: string) {
    this.token = value || '';
  }

  public getToken() {
    return sessionStorage.getItem('api_token');
  }
}
