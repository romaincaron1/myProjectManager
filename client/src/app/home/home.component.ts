import { Component } from '@angular/core';
import { User } from '../auth/user';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="mt-5">
      <h1>Accueil</h1>
      <p>Bienvenue sur l'application de gestion de projets.</p>
      <p *ngIf="isLoggedIn">Vous êtes connecté en tant que {{ currentUser?.firstname }} {{ currentUser?.lastname }}.</p>
      <p *ngIf="!isLoggedIn">Vous n'êtes pas connecté.</p>
      <button class="btn btn-primary" *ngIf="!isLoggedIn" (click)="router.navigate(['/login'])">Se connecter</button>
    </div>
  `,
  styles: [
  ]
})
export class HomeComponent {
  isLoggedIn: boolean = false;
  currentUser: User | null = null;
  
  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.getCurrentUser().subscribe((user: User) => {
      this.currentUser = user;
    });
  }
}
