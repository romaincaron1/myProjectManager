import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from './teacher';
import { Observable, Subject, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private url = 'http://localhost:7001';
  private teachers$: Subject<Teacher[]> = new Subject();

  constructor(private httpClient: HttpClient) {}

  private refreshTeachers() {
    this.httpClient
      .get<Teacher[]>(`${this.url}/api/users`)
      .pipe(
        map(teachers => teachers.filter(teacher => teacher.role === 'teacher'))
      )
      .subscribe((teachers) => {
        this.teachers$.next(teachers);
      });
  }

  getTeachers(): Subject<Teacher[]> {
    this.refreshTeachers();
    return this.teachers$;
  }
  
  getTeacher(id: string): Observable<Teacher> {
    return this.httpClient.get<Teacher>(`${this.url}/api/users/${id}`);
  }
  
  createTeacher(teacher: Teacher): Observable<string> {
    return this.httpClient.post(`${this.url}/api/users`, teacher, { responseType: 'text' });
  }
  
  updateTeacher(id: string, teacher: Teacher): Observable<string> {
    return this.httpClient.put(`${this.url}/api/users/${id}`, teacher, { responseType: 'text' });
  }
  
  deleteTeacher(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/api/users/${id}`, { responseType: 'text' });
  }
}
