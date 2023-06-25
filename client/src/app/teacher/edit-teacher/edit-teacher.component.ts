import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Teacher } from '../teacher';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../teacher.service';

@Component({
  selector: 'app-edit-teacher',
  template: `
    <button class="btn btn-primary my-4" [routerLink]="['/teachers']">
      <i class="fa-solid fa-arrow-left"></i> Retour à la liste des enseignants
    </button>
    <h2>Ajouter un enseignant</h2>
    <hr />
    <div class="alert alert-danger" role="alert" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>
    <app-teacher-form
      [initialState]="teacher"
      (formSubmitted)="editTeacher($event)"
    ></app-teacher-form>
  `,
  styles: [],
})
export class EditTeacherComponent {
  teacher: BehaviorSubject<Teacher> = new BehaviorSubject({} as Teacher);
  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private teacherService: TeacherService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided');
    }

    this.teacherService.getTeacher(id!).subscribe((teacher) => {
      this.teacher.next(teacher);
    });
  }

  editTeacher(teacher: Teacher) {
    this.teacherService
      .updateTeacher(this.teacher.value._id || '', teacher)
      .subscribe({
        next: () => {
          this.router.navigate(['/teachers']);
        },
        error: (error) => {
          this.errorMessage = error.error;
        },
      });
  }
}
