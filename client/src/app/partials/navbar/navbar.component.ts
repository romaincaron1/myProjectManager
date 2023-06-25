import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <header>
      <div class="px-3 py-2 text-white bg-dark">
        <div
          class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
        >
          <a
            href="#"
            class="nav-brand d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white"
          >
            <img src="/assets/logo.png" alt="MyProjectManager" class="" style="width: 100px;" />
          </a>

          <ul
            class="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small"
          >
            <li>
              <a href="/login" class="nav-link" target="_blank" *ngIf="!isLoggedIn()">
                <button class="btn btn-primary"><i class="fa-solid fa-user"></i> Connexion</button>
              </a>
            </li>
            <li>
            <button (click)="logout()" class="nav-link" *ngIf="isLoggedIn()">
              <button class="btn btn-primary"><i class="fa-solid fa-arrow-right-from-bracket"></i> Déconnexion</button>
            </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class NavbarComponent {
  constructor(private router: Router,private authService: AuthService) { }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
