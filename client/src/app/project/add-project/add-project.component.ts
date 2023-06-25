import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { Project } from '../project';
import { TeacherService } from 'src/app/teacher/teacher.service';
import { SkillService } from 'src/app/skill/skill.service';
import { Skill } from 'src/app/skill/skill';

@Component({
  selector: 'app-add-project',
  template: `
    <button class="btn btn-primary my-4" [routerLink]="['/projects']">
      <i class="fa-solid fa-arrow-left"></i> Retour à la liste des projets
    </button>
    <h2>Ajouter un projet</h2>
    <hr />
    <div class="alert alert-danger" role="alert" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>
    <app-project-form (formSubmitted)="addProject($event)"></app-project-form>
  `,
  styles: [
  ]
})
export class AddProjectComponent {
  errorMessage: string = '';
  skills: Skill[] = [];

  constructor(private router: Router, private projectService: ProjectService, private skillService: SkillService) {}

  ngOnInit() {
    this.skillService.getSkills().subscribe(
      (skills: Skill[]) => {
        this.skills = skills;
      },
      (error: any) => {
        this.errorMessage = 'Erreur lors de la récupération des compétences.';
      }
    );
  }  

  addProject(project: Project) {
    this.projectService.createProject(project).subscribe({
      next: () => {
        this.router.navigate(['/projects']);
      },
      error: (error: any) => {
        this.errorMessage = error.error;
      },
    });
  }
}
