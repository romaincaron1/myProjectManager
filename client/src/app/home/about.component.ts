import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <h1 class="mt-5">À propos de MyProjectManager</h1>
    <div class="row">
      <div class="col-md-10">
        <p>
          MyProjectManager est une application de gestion de projets. Elle
          permet de créer des projets et de gérer les compétences des
          utilisateurs. Elle a été créée dans le cadre du cours de développement
          web à l'UPJV d'Amiens.
        </p>
      </div>
    </div>
  `,
  styles: [],
})
export class AboutComponent {}
