import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';

@Component({
  selector: 'app-sidebar',
  template: `
    <nav class="d-flex flex-column flex-shrink-0 mt-4">
      <div class="accordion" id="accordionSidebar">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse1"
              aria-expanded="false"
              aria-controls="collapse1"
            >
              <span><i class="fa-solid fa-house me-2"></i> Menu principal</span
              >
            </button>
          </h2>
          <div id="collapse1" class="accordion-collapse collapse" aria-labelledby="heading1">
            <div class="accordion-body">
              <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                  <a href="#" class="nav-link" aria-current="page">
                    <i class="fa-solid fa-house me-2"></i> Accueil
                  </a>
                </li>
                <li class="nav-item">
                  <a href="/about" class="nav-link" aria-current="page">
                    <i class="fa-solid fa-circle-info me-2"></i> À propos
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="accordion-item" *ngIf="currentUser && currentUser?.role == 'admin'">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse2"
              aria-expanded="false"
              aria-controls="collapse2"
            >
              <span><i class="fa-solid fa-chalkboard-user"></i> Enseignants</span>
            </button>
          </h2>
          <div
            id="collapse2"
            class="accordion-collapse collapse" [class.show]="isTeachersRoute()"
            aria-labelledby="heading2"
          >
            <div class="accordion-body">
              <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                  <a href="/teachers" class="nav-link" aria-current="page">
                    <i class="fa-solid fa-chalkboard-user"></i> Vue d'ensemble
                  </a>
                </li>
                <li class="nav-item">
                  <a href="/teachers/new" class="nav-link" aria-current="page">
                  <i class="fa-solid fa-plus me-2"></i> Nouvel enseignant
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="accordion-item" *ngIf="currentUser && currentUser?.role == 'admin'">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse3"
              aria-expanded="false"
              aria-controls="collapse3"
            >
              <span><i class="fa-solid fa-users"></i> Étudiants</span>
            </button>
          </h2>
          <div
            id="collapse3"
            class="accordion-collapse collapse" [class.show]="isStudentRoute()"
            aria-labelledby="heading3"
          >
            <div class="accordion-body">
              <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                  <a href="/students" class="nav-link" aria-current="page">
                  <i class="fa-solid fa-users"></i> Vue d'ensemble
                  </a>
                </li>
                <li class="nav-item">
                  <a href="/students/new" class="nav-link" aria-current="page">
                  <i class="fa-solid fa-plus me-2"></i> Nouvel étudiant
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="accordion-item" *ngIf="currentUser">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse4"
              aria-expanded="false"
              aria-controls="collapse4"
            >
              <span><i class="fa-solid fa-diagram-project"></i> Projets</span>
            </button>
          </h2>
          <div
            id="collapse4"
            class="accordion-collapse collapse" [class.show]="isProjectRoute()"
            aria-labelledby="heading4"
          >
            <div class="accordion-body">
              <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                  <a href="/projects" class="nav-link" aria-current="page">
                  <i class="fa-solid fa-diagram-project"></i> Vue d'ensemble
                  </a>
                </li>
                <li class="nav-item" *ngIf="currentUser?.role == 'teacher' || currentUser?.role == 'admin'">
                  <a href="/projects/new" class="nav-link" aria-current="page">
                  <i class="fa-solid fa-plus me-2"></i> Nouveau projet
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

  `,
  styles: [],
})

export class SidebarComponent implements OnInit {
  isLoggedIn: boolean = false;
  currentUser: User | null = null;
  
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.getCurrentUser().subscribe((user: User) => {
      this.currentUser = user;
    });
  }

  isTeachersRoute(): boolean {
    return this.router.url.includes('/teachers');
  }

  isStudentRoute(): boolean {
    return this.router.url.includes('/students');
  }

  isProjectRoute(): boolean {
    return this.router.url.includes('/projects');
  }

  isSkillRoute(): boolean {
    return this.router.url.includes('/skills');
  }

}
