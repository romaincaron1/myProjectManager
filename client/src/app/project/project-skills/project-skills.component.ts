import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../project';
import { Skill } from 'src/app/skill/skill';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { SkillService } from 'src/app/skill/skill.service';
import { StudentService } from 'src/app/student/student.service';
import { Student } from 'src/app/student/student';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-project-skills',
  template: `
    <div *ngIf="project">
      <h2 class="mt-5">Détails du projet</h2>
      <hr />
      <div>
        <h4>Nom du projet</h4>
        <p>{{ project.name }}</p>
      </div>
      <form [formGroup]="skillForm" (ngSubmit)="updateStudentSkills()">
        <div>
          <h4>Compétences</h4>
          <hr />
          <div class="mt-4">
            <div class="row" *ngFor="let skill of skills">
              <div *ngIf="!skill.required" class="col-md-4">
                <h6>
                  <strong>{{ skill.name }}</strong>
                </h6>
                <p>{{ skill.description }}</p>
              </div>
              <div *ngIf="!skill.required" class="col-md-4 form-group">
                <label for="state">État de compétence</label>
                <select class="form-control" id="state" [formControlName]="skill._id + '.state'" style="pointer-events: none;">
                  <option value="not_acquired">Non acquis</option>
                  <option value="in_progress">En cours</option>
                  <option value="acquired">Acquis</option>
                </select>

              </div>
              <div *ngIf="!skill.required" class="col-md-4 form-group">
                <label for="progress">Progression (%)</label>
                <input
                  type="number"
                  class="form-control"
                  id="progress"
                  min="0"
                  max="100"
                  [formControlName]="skill._id + '.progress'"
                  (ngModelChange)="updateProgress(skill._id, $event)"
                />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Enregistrer</button>
      </form>
    </div>
  `,
  styles: [],
})
export class ProjectSkillsComponent implements OnInit {
  project: Project | undefined;
  skills: Skill[] = [];
  student: Student | undefined;
  skillForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private skillService: SkillService,
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.skillForm = this.formBuilder.group({
      state: ['not_acquired', Validators.required],
      progress: [0, Validators.min(0)],
    });
  }

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectService.getProject(projectId).subscribe((project) => {
        this.project = project;
        const skillIds = project.skills || [];
        this.skillService.getSkillsByIds(skillIds).subscribe((skills) => {
          this.skills = skills;
          this.createFormControls();
        });
      });

      // Fetch student information
      this.authService.getCurrentStudent().subscribe((student: Student) => {
        this.student = student;
      });
    }
  }

  createFormControls() {
    this.skills.forEach((skill) => {
      if (!skill.required) {
        const stateValue = this.student?.skills.find((s) => s._id === skill._id)?.state || 'not_acquired';
        const progressValue = this.student?.skills.find((s) => s._id === skill._id)?.progress || 0;
  
        this.skillForm.addControl(
          skill._id + '.state',
          this.formBuilder.control(stateValue, Validators.required)
        );
        this.skillForm.addControl(
          skill._id + '.progress',
          this.formBuilder.control(progressValue, Validators.min(0))
        );
      }
    });
  }  

  updateStudentSkills() {
    if (this.student) {
      const skills = Object.keys(this.skillForm.value)
        .filter(key => key.includes('.state'))
        .map(key => ({
          _id: key.split('.state')[0],
          name: this.skills.find(skill => skill._id === key.split('.state')[0])?.name || '',
          state: this.skillForm.value[key],
          progress: this.skillForm.value[key.split('.state')[0] + '.progress']
        }));
  
      this.student.skills = skills;
  
      this.studentService.updateStudent(this.student._id, this.student)
        .subscribe(() => {
          this.router.navigate(['/projects']); // Redirection vers la page des compétences
        });
    }
  }

  updateProgress(skillId: string, event: number) {
    const value = skillId + '.state';
    const elements = document.querySelectorAll(`[ng-reflect-name="${value}"]`)
    const stateValue: any = elements[0];

    if (stateValue) {
      if (event == 100) {
        this.skillForm.value[skillId + '.state'] = "acquired";
        stateValue.value = 'acquired';
      } else if (event > 0) {
        this.skillForm.value[skillId + '.state'] = "in_progress";
        stateValue.value = 'in_progress';
      } else {
        this.skillForm.value[skillId + '.state'] = "not_acquired";
        stateValue.value = 'not_acquired';
      }
    }
  }

  
  
}
