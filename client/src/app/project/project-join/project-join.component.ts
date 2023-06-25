import { Component } from '@angular/core';
import { Project } from '../project';
import { Skill } from 'src/app/skill/skill';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { SkillService } from 'src/app/skill/skill.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from 'src/app/student/student';
import { User } from 'src/app/auth/user';
import { StudentService } from 'src/app/student/student.service';

@Component({
  selector: 'app-project-join',
  template: `
    <div class="row mt-5">
      <h1>Projet {{ project?.name }}</h1>
      <div class="alert alert-danger">
        Des compétences sont requises pour accéder à ce projet
      </div>
      <ul>
        <li *ngFor="let skill of skills" style="list-style-type: none;">
          <ng-container *ngIf="skill.required">
            {{ skill.name }}
          </ng-container>
        </li>
      </ul>
    </div>
    <button
      (click)="joinProject()"
      class="btn btn-success"
      *ngIf="
        project &&
        currentUser?.role == 'student' &&
        !currentUser?.projects?.includes(project._id)
      "
    >
      <i class="fa-solid fa-arrow-right"></i> Rejoindre ce projet
    </button>
  `,
  styles: [],
})
export class ProjectJoinComponent {
  project: Project | undefined;
  skills: Skill[] = [];
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private skillService: SkillService,
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectService.getProject(projectId).subscribe((project) => {
        this.project = project;
        const skillIds = project.skills || [];
        this.skillService.getSkillsByIds(skillIds).subscribe((skills) => {
          this.skills = skills;
        });
      });
    }

    this.authService.getCurrentUser().subscribe((user: User) => {
      this.currentUser = user;
    });
  }

  joinProject(): void {
    if (this.currentUser) {
      const student: Student = {
        _id: this.currentUser._id,
        lastname: this.currentUser.lastname,
        firstname: this.currentUser.firstname,
        email: this.currentUser.email,
        projects: this.currentUser.projects.concat(this.project?._id || ''),
        skills: this.currentUser.skills,
        password: this.currentUser.password,
        role: 'student',
      };
      console.log(student)
      this.studentService
        .updateStudent(this.currentUser._id, student)
        .subscribe({
          next: () =>
            this.authService.getCurrentUser().subscribe((user: User) => {
              this.currentUser = user;
            }),
        });
        this.router.navigate(['/projects']);
    }
  }
}
