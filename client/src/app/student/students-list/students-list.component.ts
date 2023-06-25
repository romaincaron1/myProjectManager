import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../student';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-students-list',
  template: `
    <h2 class="mt-5">Liste des étudiants</h2>
    <hr />
    <button class="btn btn-primary mb-5" [routerLink]="['new']">
      <i class="fa-solid fa-plus"></i> Ajouter un étudiant
    </button>

    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Adresse e-mail</th>
          <th style="min-width: 240px"></th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let student of students$ | async">
          <td>{{ student.lastname }}</td>
          <td>{{ student.firstname }}</td>
          <td>{{ student.email }}</td>
          <td class="text-end">
            <button
              class="btn btn-primary me-1"
              [routerLink]="['edit/', student._id]"
            >
              <i class="fa-regular fa-pen-to-square"></i> Modifier
            </button>
            <button
              class="btn btn-danger"
              (click)="deleteStudent(student._id || '')"
            >
              <i class="fa-solid fa-trash"></i> Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [],
})
export class StudentsListComponent {
  students$: Observable<Student[]> = new Observable();
 
  constructor(private studentService: StudentService) { }
  
  ngOnInit(): void {
    this.fetchTeachers();
  }
  
  deleteStudent(id: string): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => this.fetchTeachers()
    });
  }
  
  private fetchTeachers(): void {
    this.students$ = this.studentService.getStudents();
  }
}
