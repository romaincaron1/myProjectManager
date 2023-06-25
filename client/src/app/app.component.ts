import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <div class="row">
      <div class="col-12 d-grid d-md-none">
        <button
          class="collapsed mt-3 btn btn-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebar"
          aria-controls="sidebar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>
      <aside
        id="sidebar"
        class="col-md-4 col-lg-3 col-xl-2 d-md-block collapse"
      >
        <app-sidebar></app-sidebar>
      </aside>
      <main id="main" class="col-md-8 col-lg-9 col-xl-10 pl-lg-2">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'client';
}
