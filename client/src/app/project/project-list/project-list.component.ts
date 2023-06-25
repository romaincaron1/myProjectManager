import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../project';
import { ProjectService } from '../project.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';
import { StudentService } from 'src/app/student/student.service';
import { Student } from 'src/app/student/student';
import { TeacherService } from 'src/app/teacher/teacher.service';

@Component({
  selector: 'app-project-list',
  template: `
    <h2 class="mt-5">Liste des projets</h2>
    <hr />
    <button
      class="btn btn-primary mb-5"
      [routerLink]="['new']"
      *ngIf="currentUser?.role == 'admin' || currentUser?.role == 'teacher'"
    >
      <i class="fa-solid fa-plus"></i> Ajouter un projet
    </button>

    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Nom</th>
          <th style="min-width: 240px"></th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let project of projects$ | async">
          <td *ngIf="currentUser?.role == 'student' || currentUser?.role == 'admin' || project.owner == currentUser?._id ">{{ project.name }}</td>
          <td class="text-end" *ngIf="currentUser?.role == 'student' || currentUser?.role == 'admin' || project.owner == currentUser?._id ">
            <button
              class="btn btn-success me-1"
              [routerLink]="['join/', project._id]"
              *ngIf="
                currentUser?.role == 'student' &&
                !currentUser?.projects?.includes(project._id)
              "
            >
              <i class="fa-solid fa-arrow-right"></i> Rejoindre ce projet
            </button>
            <button
              class="btn btn-success me-1"
              [routerLink]="['skills/', project._id]"
              *ngIf="
                currentUser?.role == 'student' &&
                currentUser?.projects?.includes(project._id)
              "
            >
              <i class="fa-solid fa-arrow-right"></i> Modifier mes compétences
            </button>
            <button
              class="btn btn-danger me-1"
              (click)="leaveProject(project._id || '')"
              *ngIf="
                currentUser?.role == 'student' &&
                currentUser?.projects?.includes(project._id)
              "
            >
              <i class="fa-solid fa-arrow-left"></i> Quitter le projet
            </button>
            <button
              class="btn btn-primary me-1"
              [routerLink]="['details/', project._id]"
            >
              <i class="fa-solid fa-list"></i> Informations
            </button>
            <button
              *ngIf="currentUser?.role == 'admin'"
              class="btn btn-danger"
              (click)="deleteProject(project._id || '')"
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
export class ProjectListComponent {
  projects$: Observable<Project[]> = new Observable();
  currentUser: User | null = null;
  projectOwnerName: string = '';

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private studentService: StudentService,
    private teacherSerivce: TeacherService
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.authService.getCurrentUser().subscribe((user: User) => {
      this.currentUser = user;
    });
  }

  deleteProject(id: string): void {
    this.projectService.deleteProject(id).subscribe({
      next: () => this.fetchProjects(),
    });
  }

  private fetchProjects(): void {
    this.projects$ = this.projectService.getProjects();
  }

  joinProject(project: string): void {
    if (this.currentUser) {
      const student: Student = {
        _id: this.currentUser._id,
        lastname: this.currentUser.lastname,
        firstname: this.currentUser.firstname,
        email: this.currentUser.email,
        skills: this.currentUser.skills,
        projects: this.currentUser.projects.concat(project),
        password: this.currentUser.password,
        role: 'student',
      };
      this.studentService
        .updateStudent(this.currentUser._id, student)
        .subscribe({
          next: () =>
            this.authService.getCurrentUser().subscribe((user: User) => {
              this.currentUser = user;
            }),
        });
    }
  }

  leaveProject(project: string): void {
    if (this.currentUser) {
      const student: Student = {
        _id: this.currentUser._id,
        lastname: this.currentUser.lastname,
        firstname: this.currentUser.firstname,
        email: this.currentUser.email,
        projects: this.currentUser.projects.filter(
          (p: string) => p !== project
        ),
        skills: this.currentUser.skills,
        password: this.currentUser.password,
        role: 'student',
      };
      this.studentService
        .updateStudent(this.currentUser._id, student)
        .subscribe({
          next: () =>
            this.authService.getCurrentUser().subscribe((user: User) => {
              this.currentUser = user;
            }),
        });
    }
  }
}
