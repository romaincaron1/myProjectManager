import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { AddTeacherComponent } from './teacher/add-teacher/add-teacher.component';
import { EditTeacherComponent } from './teacher/edit-teacher/edit-teacher.component';
import { StudentsListComponent } from './student/students-list/students-list.component';
import { AddStudentComponent } from './student/add-student/add-student.component';
import { EditStudentComponent } from './student/edit-student/edit-student.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { DetailsProjectComponent } from './project/details-project/details-project.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/authGuard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './home/about.component';
import { ProjectSkillsComponent } from './project/project-skills/project-skills.component';
import { ProjectJoinComponent } from './project/project-join/project-join.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},
  { path: 'about', component: AboutComponent },
  { path: 'teachers', component: TeacherListComponent, canActivate: [AuthGuard] },
  { path: 'teachers/new', component: AddTeacherComponent, canActivate: [AuthGuard] },
  { path: 'teachers/edit/:id', component: EditTeacherComponent, canActivate: [AuthGuard] },
  { path: 'students', component: StudentsListComponent, canActivate: [AuthGuard] },
  { path: 'students/new', component: AddStudentComponent, canActivate: [AuthGuard] },
  { path: 'students/edit/:id', component: EditStudentComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard] },
  { path: 'projects/new', component: AddProjectComponent, canActivate: [AuthGuard] },
  { path: 'projects/details/:id', component: DetailsProjectComponent, canActivate: [AuthGuard] },
  { path: 'projects/skills/:id', component: ProjectSkillsComponent, canActivate: [AuthGuard] },
  { path: 'projects/join/:id', component: ProjectJoinComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
