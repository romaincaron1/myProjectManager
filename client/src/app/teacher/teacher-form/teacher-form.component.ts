import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Teacher } from '../teacher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher-form',
  template: `
   <form class="teacher-form" autocomplete="off" [formGroup]="teacherForm" (ngSubmit)="submitForm()">
     <div class="form-floating mb-3">
       <input class="form-control" type="text" id="lastname" formControlName="lastname" placeholder="Entrez le nom de famille" required>
       <label for="lastname">Nom de famille</label>
     </div>
 
     <div *ngIf="lastname.invalid && (lastname.dirty || lastname.touched)" class="text-danger mt-0 mb-4">
       <div *ngIf="lastname.errors?.['required']">
         Le nom de famille est obligatoire.
       </div>
       <div *ngIf="lastname.errors?.['minlength']">
         Le nom de famille doit comporter au moins 3 caractères.
       </div>
     </div>
 
     <div class="form-floating mb-3">
       <input class="form-control" type="text" id="firstname" formControlName="firstname" placeholder="Entrez le prénom" required>
       <label for="firstname">Prénom</label>
     </div>
 
     <div *ngIf="firstname.invalid && (firstname.dirty || firstname.touched)" class="text-danger mt-0 mb-4">
 
       <div *ngIf="firstname.errors?.['required']">
         Le prénom est obligatoire.
       </div>
       <div *ngIf="firstname.errors?.['minlength']">
          Le prénom doit comporter au moins 3 caractères.
       </div>
     </div>

     <div class="form-floating mb-3">
       <input class="form-control" type="text" id="email" formControlName="email" placeholder="Entrez l'adresse e-mail" required>
       <label for="email">Adresse e-mail</label>
     </div>
 
     <div *ngIf="email.invalid && (email.dirty || email.touched)" class="text-danger mt-0 mb-4">
 
       <div *ngIf="email.errors?.['required']">
         L'adresse e-mail est obligatoire.
       </div>
       <div *ngIf="email.errors?.['minlength']">
         L'adresse e-mail doit comporter au moins 5 caractères.
       </div>
     </div>

     <div class="form-floating mb-3">
       <input class="form-control" type="password" id="password" formControlName="password" placeholder="Entrez le mot de passe" required>
       <label for="password">Mot de passe</label>
     </div>
 
     <div *ngIf="password.invalid && (password.dirty || password.touched)" class="text-danger mt-0 mb-4">
 
       <div *ngIf="password.errors?.['required']">
         Le mot de passe est obligatoire
       </div>
       <div *ngIf="password.errors?.['minlength']">
         Le mot de passe doit comporter au moins 6 caractères.
       </div>
     </div>
 
     <button class="btn btn-primary" style="background-color: #5a609b; border: #5a609b;" type="submit" [disabled]="teacherForm.invalid">Enregistrer</button>
     <small class="mx-4"><i class="fa-solid fa-triangle-exclamation"></i> Tous les champs sont obligatoires</small>
   </form>
  `,
  styles: [
    `.teacher-form {
      max-width: 540px;
      margin: 2rem 0;
    }`
  ]
})
export class TeacherFormComponent implements OnInit {
  @Input()
  initialState: BehaviorSubject<Teacher> = new BehaviorSubject({} as Teacher);
  
  @Output()
  formValuesChanged = new EventEmitter<Teacher>();
  
  @Output()
  formSubmitted = new EventEmitter<Teacher>();
  
  teacherForm: FormGroup = new FormGroup({});
  
  constructor(private fb: FormBuilder) { }
  
  get lastname() { return this.teacherForm.get('lastname')!; }
  get firstname() { return this.teacherForm.get('firstname')!; }
  get email() { return this.teacherForm.get('email')!; }
  get password() { return this.teacherForm.get('password')!; }
  
  ngOnInit() {
    this.initialState.subscribe(teacher => {
      this.teacherForm = this.fb.group({
        lastname: [ teacher.lastname, [Validators.required, Validators.minLength(3)] ],
        firstname: [ teacher.firstname, [ Validators.required, Validators.minLength(3) ] ],
        email: [ teacher.email, [Validators.required, Validators.minLength(5)] ],
        password: [ teacher.password, [Validators.required, Validators.minLength(6)] ],
        role: "teacher"
      });
    });
  
    this.teacherForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
  }
  
  submitForm() {
    this.formSubmitted.emit(this.teacherForm.value);
  }
 }
