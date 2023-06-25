import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student } from '../student';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-edit-student',
  template: `
    <button class="btn btn-primary my-4" [routerLink]="['/students']">
      <i class="fa-solid fa-arrow-left"></i> Retour à la liste des étudiants
    </button>
    <h2>Modifier un étudiant</h2>
    <hr />
    <div class="alert alert-danger" role="alert" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>
    <app-student-form
      [initialState]="student"
      (formSubmitted)="editStudent($event)"
    ></app-student-form>
  `,
  styles: [],
})
export class EditStudentComponent {
  student: BehaviorSubject<Student> = new BehaviorSubject({} as Student);
  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private teacherService: StudentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided');
    }

    this.teacherService.getStudent(id!).subscribe((student) => {
      this.student.next(student);
    });
  }

  editStudent(student: Student) {
    this.teacherService
      .updateStudent(this.student.value._id || '', student)
      .subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: (error) => {
          this.errorMessage = error.error;
        },
      });
  }
}
