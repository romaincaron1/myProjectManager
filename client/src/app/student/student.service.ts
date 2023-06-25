import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { Student } from './student';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private url = 'http://localhost:7001';
  private students$: Subject<Student[]> = new Subject();

  constructor(private httpClient: HttpClient) {}

  private refreshStudents() {
    this.httpClient
      .get<Student[]>(`${this.url}/api/users`)
      .pipe(
        map(students => students.filter(student => student.role === 'student'))
      )
      .subscribe((students) => {
        this.students$.next(students);
      });
  }

  getStudents(): Subject<Student[]> {
    this.refreshStudents();
    return this.students$;
  }
  
  getStudent(id: string): Observable<Student> {
    return this.httpClient.get<Student>(`${this.url}/api/users/${id}`);
  }
  
  createStudent(student: Student): Observable<string> {
    return this.httpClient.post(`${this.url}/api/users`, student, { responseType: 'text' });
  }
  
  updateStudent(id: string, student: Student): Observable<string> {
    return this.httpClient.patch(`${this.url}/api/users/${id}`, student, { responseType: 'text' });
  }
  
  deleteStudent(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/api/users/${id}`, { responseType: 'text' });
  }
}
