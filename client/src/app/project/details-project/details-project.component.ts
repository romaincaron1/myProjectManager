import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../project';
import { ProjectService } from '../project.service';
import { Skill } from 'src/app/skill/skill';
import { SkillService } from 'src/app/skill/skill.service';
import { Student } from 'src/app/student/student';
import { StudentService } from 'src/app/student/student.service';
import { User } from 'src/app/auth/user';

@Component({
  selector: 'app-details-project',
  template: `
    <div class="container" *ngIf="project">
      <h2 class="mt-5">Détails du projet</h2>
      <hr />
      <div>
        <h4>Nom du projet</h4>
        <p>{{ project.name }}</p>
      </div>
      <div>
        <h4>Compétences</h4>
        <ul class="list-group">
          <li class="list-group-item" *ngFor="let skill of skills">
            {{ skill.name }} ({{ skill.required ? 'Requise' : 'Non requise' }}) - {{ skill.description }}
          </li>
        </ul>
      </div>
    </div>
    <div class="container" *ngIf="users.length > 0">
      <h2 class="mt-5">Utilisateurs</h2>
      <hr />
      <table class="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>E-mail</th>
            <th>Compétences</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>{{ user.lastname }}</td>
            <td>{{ user.firstname }}</td>
            <td>{{ user.email }}</td>
            <td>
              <ul class="list-group">
              <li class="list-group-item" *ngFor="let skill of user.skills" [ngClass]="getSkillClass(skill.state)">
                  {{ skill.name }} ({{ getSkillState(skill.state) }}) - {{ skill.progress }}%
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [],
})
export class DetailsProjectComponent implements OnInit {
  project: Project | undefined;
  skills: Skill[] = [];
  users: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private skillService: SkillService,
    private studentService: StudentService
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

    this.studentService.getStudents().subscribe((students) => {
      if (projectId) {
        this.users = students
          .filter((student) => student.projects.includes(projectId))
          .map((student) => {
            const userSkills = student.skills.map((skill) => {
              const projectSkill = this.skills.find((s) => s._id === skill._id);
              return {
                ...projectSkill,
                name: skill.name,
                state: skill.state,
                progress: skill.progress,
              };
            });
            return {
              ...student,
              skills: userSkills,
            };
          });
      }
    });
  }

  getSkillState(state: string): string {
    if (state === 'not_acquired') {
      return 'Non acquise';
    } else if (state === 'in_progress') {
      return 'En cours';
    } else if (state === 'acquired') {
      return 'Acquise';
    }
    return '';
  }

  getSkillClass(state: string): string {
    if (state === 'not_acquired') {
      return 'bg-danger';
    } else if (state === 'in_progress') {
      return 'bg-warning';
    } else if (state === 'acquired') {
      return 'bg-success';
    }
    return '';
  }
}
