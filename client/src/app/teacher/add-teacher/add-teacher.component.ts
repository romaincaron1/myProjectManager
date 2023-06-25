import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../teacher.service';
import { Teacher } from '../teacher';

@Component({
  selector: 'app-add-teacher',
  template: `
    <button class="btn btn-primary my-4" [routerLink]="['/teachers']">
      <i class="fa-solid fa-arrow-left"></i> Retour à la liste des enseignants
    </button>
    <h2>Ajouter un enseignant</h2>
    <hr />
    <div class="alert alert-danger" role="alert" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>
    <app-teacher-form (formSubmitted)="addTeacher($event)"></app-teacher-form>
  `,
  styles: [],
})
export class AddTeacherComponent {
  errorMessage: string = '';

  constructor(private router: Router, private teacherService: TeacherService) {}

  addTeacher(teacher: Teacher) {
    this.teacherService.createTeacher(teacher).subscribe({
      next: () => {
        this.router.navigate(['/teachers']);
      },
      error: (error: any) => {
        this.errorMessage = error.error;
      },
    });
  }
}
