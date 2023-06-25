import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../project';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Skill } from 'src/app/skill/skill';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';

@Component({
  selector: 'app-project-form',
  template: `
    <form
      class="project-form"
      autocomplete="off"
      [formGroup]="projectForm"
      (ngSubmit)="submitForm()"
    >
      <div
        *ngIf="name.invalid && (name.dirty || name.touched)"
        class="alert alert-danger"
      >
        <div *ngIf="name.errors?.['required']">
          Le nom du projet est obligatoire.
        </div>
      </div>

      <div class="form-floating mb-3 col-md-6">
        <input
          class="form-control"
          type="text"
          id="name"
          formControlName="name"
          placeholder="Entrez le nom du projet"
          required
        />
        <label for="name">Nom du projet</label>
      </div>

      <div class="form-group mb-3 col-md-12">
        <div formArrayName="skills">
          <div *ngFor="let skill of skills.controls; let i = index">
            <div [formGroupName]="i" class="form-group d-flex gap-4">
              <input
                type="text"
                class="form-control"
                formControlName="name"
                placeholder="Nom de la compétence"
              />
              <input
                type="text"
                class="form-control"
                formControlName="description"
                placeholder="Description"
              />
              <label for="required">Obligatoire ?</label>
              <input type="checkbox" formControlName="required" />
              <button (click)="removeSkill(i)" class="btn btn-danger">
                Supprimer
              </button>
            </div>
          </div>
        </div>
        <button type="button" (click)="addSkill()" class="btn btn-primary">
          <i class="fa-solid fa-plus me-2"></i> Ajouter une compétence
        </button>
      </div>

      <div>
        <button class="btn btn-primary" type="submit">Enregistrer</button>
      </div>
    </form>
  `,
  styles: [
    `
      .project-form {
        max-width: 70%;
        margin: 2rem 0;
      }
    `,
  ],
})
export class ProjectFormComponent {
  @Input()
  initialState: BehaviorSubject<Project> = new BehaviorSubject({} as Project);

  @Output()
  formValuesChanged = new EventEmitter<Project>();

  @Output()
  formSubmitted = new EventEmitter<Project>();

  projectForm: FormGroup;
  currentUser: User | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.projectForm = this.createForm();
  }

  get name() {
    return this.projectForm.get('name')!;
  }

  get skills() {
    return this.projectForm.get('skills') as FormArray;
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });

    this.initialState.subscribe((project) => {
      this.updateForm(project);
    });

    this.projectForm.valueChanges.subscribe((val) => {
      this.formValuesChanged.emit(val);
    });
  }

  createForm() {
    return this.fb.group({
      name: ['', [Validators.required]],
      owner: '',
      skills: this.fb.array([]),
    });
  }

  updateForm(project: Project) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.projectForm.patchValue({
        name: project.name,
        owner: user._id,
        skills: project.skills || [],
      });
    });
  }

  submitForm() {
    this.formSubmitted.emit(this.projectForm.value);
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  addSkill() {
    const skillGroup = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      required: [false],
    });
    this.skills.push(skillGroup);
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }
}
