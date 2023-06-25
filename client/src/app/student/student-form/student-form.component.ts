import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student } from '../student';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-form',
  template: `
   <form class="student-form" autocomplete="off" [formGroup]="studentForm" (ngSubmit)="submitForm()">
     <div class="form-floating mb-3">
       <input class="form-control" type="text" id="lastname" formControlName="lastname" placeholder="Entrez le nom de famille" required>
       <label for="lastname">Nom de famille</label>
     </div>
 
     <div *ngIf="lastname.invalid && (lastname.dirty || lastname.touched)" class="alert alert-danger">
       <div *ngIf="lastname.errors?.['required']">
         Le nom de famille est obligatoire.
       </div>
       <div *ngIf="lastname.errors?.['minlength']">
         Name must be at least 3 characters long.
       </div>
     </div>
 
     <div class="form-floating mb-3">
       <input class="form-control" type="text" id="firstname" formControlName="firstname" placeholder="Entrez le prénom" required>
       <label for="firstname">Prénom</label>
     </div>
 
     <div *ngIf="firstname.invalid && (firstname.dirty || firstname.touched)" class="alert alert-danger">
 
       <div *ngIf="firstname.errors?.['required']">
         Le prénom est obligatoire.
       </div>
       <div *ngIf="firstname.errors?.['minlength']">
         Position must be at least 5 characters long.
       </div>
     </div>

     <div class="form-floating mb-3">
       <input class="form-control" type="text" id="email" formControlName="email" placeholder="Entrez l'adresse e-mail" required>
       <label for="email">Adresse e-mail</label>
     </div>
 
     <div *ngIf="email.invalid && (email.dirty || email.touched)" class="alert alert-danger">
 
       <div *ngIf="email.errors?.['required']">
         L'adresse e-mail est obligatoire.
       </div>
       <div *ngIf="email.errors?.['minlength']">
         Position must be at least 5 characters long.
       </div>
     </div>

     <div class="form-floating mb-3">
       <input class="form-control" type="password" id="password" formControlName="password" placeholder="Entrez le mot de passe" required>
       <label for="password">Mot de passe</label>
     </div>
 
     <div *ngIf="password.invalid && (password.dirty || password.touched)" class="alert alert-danger">
 
       <div *ngIf="password.errors?.['required']">
         Le mot de passe est obligatoire
       </div>
       <div *ngIf="password.errors?.['minlength']">
         Position must be at least 5 characters long.
       </div>
     </div>
 
     <button class="btn btn-primary" type="submit" [disabled]="studentForm.invalid">Enregistrer</button>
   </form>
  `,
  styles: [
    `.student-form {
      max-width: 540px;
      margin: 2rem 0;
    }`
  ]
})
export class StudentFormComponent {
  @Input()
  initialState: BehaviorSubject<Student> = new BehaviorSubject({} as Student);
  
  @Output()
  formValuesChanged = new EventEmitter<Student>();
  
  @Output()
  formSubmitted = new EventEmitter<Student>();
  
  studentForm: FormGroup = new FormGroup({});
  
  constructor(private fb: FormBuilder) { }
  
  get lastname() { return this.studentForm.get('lastname')!; }
  get firstname() { return this.studentForm.get('firstname')!; }
  get email() { return this.studentForm.get('email')!; }
  get password() { return this.studentForm.get('password')!; }
  
  ngOnInit() {
    this.initialState.subscribe(student => {
      this.studentForm = this.fb.group({
        lastname: [ student.lastname, [Validators.required, Validators.minLength(3)] ],
        firstname: [ student.firstname, [ Validators.required, Validators.minLength(3) ] ],
        email: [ student.email, [Validators.required, Validators.minLength(5)] ],
        password: [ student.password, [Validators.required, Validators.minLength(6)] ],
        role: "student"
      });
    });
  
    this.studentForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
  }
  
  submitForm() {
    this.formSubmitted.emit(this.studentForm.value);
  }
}
