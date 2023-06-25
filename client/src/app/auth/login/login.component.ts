import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'jwt-decode';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'login',
  template: ` <form [formGroup]="form">
    <fieldset class="mt-5">
      <legend>Connexion</legend>
      <div class="form-field">
        <label for="email" class="form-label">Adresse e-mail</label>
        <input id="email" name="email" formControlName="email" class="form-control" />
      </div>
      <div class="form-field">
        <label for="password" class="form-label">Mot de passe</label>
        <input id="password" name="password" class="form-control" formControlName="password" type="password" />
      </div>
    </fieldset>
    <div>
      <button class="btn btn-primary mt-4" (click)="login()">Connexion</button>
    </div>
  </form>`,
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }

  login() {
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password).subscribe((result: any) => {
        if (result) {
          const decodedToken = this.getDecodedAccessToken(result.token);
          const expiresAt = moment().add(decodedToken.exp,'second');
          localStorage.setItem('id_token', result.token);
          localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );

          window.location.href = '/';
        }
      });
    }
  }
}
