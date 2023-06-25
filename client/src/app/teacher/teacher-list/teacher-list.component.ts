import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from '../teacher';
import { TeacherService } from '../teacher.service';

@Component({
  selector: 'app-teacher-list',
  template: `
  <h2 class="mt-5">Liste des enseignants</h2>
  <hr>
  <button class="btn btn-primary mb-5" [routerLink]="['new']"><i class="fa-solid fa-plus"></i> Ajouter un enseignant</button>

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
          <tr *ngFor="let teacher of teachers$ | async">
              <td>{{teacher.lastname}}</td>
              <td>{{teacher.firstname}}</td>
              <td>{{teacher.email}}</td>
              <td class="text-end">
                  <button class="btn btn-primary me-1" [routerLink]="['edit/', teacher._id]"><i class="fa-regular fa-pen-to-square"></i> Modifier</button>
                  <button class="btn btn-danger" (click)="deleteTeacher(teacher._id || '')"><i class="fa-solid fa-trash"></i> Supprimer</button>
              </td>
          </tr>
      </tbody>
  </table>
`
})
export class TeacherListComponent {
  teachers$: Observable<Teacher[]> = new Observable();
 
  constructor(private teachersService: TeacherService) { }
  
  ngOnInit(): void {
    this.fetchTeachers();
  }
  
  deleteTeacher(id: string): void {
    this.teachersService.deleteTeacher(id).subscribe({
      next: () => this.fetchTeachers()
    });
  }
  
  private fetchTeachers(): void {
    this.teachers$ = this.teachersService.getTeachers();
  }
}
