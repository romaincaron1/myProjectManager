import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Student } from '../student/student';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:7001';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.url}/api/login`, { email, password });
  } 

  getCurrentUser(): Observable<User> {
    if (this.isLoggedIn()) {
      return this.http.get<User>(`${this.url}/api/users/me`);
    }
    return new Observable<User>();
  }

  getCurrentStudent(): Observable<Student> {
    if (this.isLoggedIn()) {
      return this.http.get<Student>(`${this.url}/api/users/me`);
    }
    return new Observable<Student>();
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    window.location.href = "/"
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration as any);
    return moment(expiresAt);
  }
}
