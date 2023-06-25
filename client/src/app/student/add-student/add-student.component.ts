import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../student.service';
import { Student } from '../student';

@Component({
  selector: 'app-add-student',
  template: `
    <button class="btn btn-primary my-4" [routerLink]="['/students']">
      <i class="fa-solid fa-arrow-left"></i> Retour à la liste des étudiants
    </button>
    <h2>Ajouter un étudiant</h2>
    <hr />
    <div class="alert alert-danger" role="alert" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>
    <app-student-form (formSubmitted)="addStudent($event)"></app-student-form>
  `,
  styles: [
  ]
})
export class AddStudentComponent {
  errorMessage: string = '';

  constructor(private router: Router, private studentService: StudentService) {}

  addStudent(student: Student) {
    this.studentService.createStudent(student).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: (error: any) => {
        this.errorMessage = error.error;
      },
    });
  }
}
