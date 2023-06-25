import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { TeacherFormComponent } from './teacher/teacher-form/teacher-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTeacherComponent } from './teacher/add-teacher/add-teacher.component';
import { EditTeacherComponent } from './teacher/edit-teacher/edit-teacher.component';
import { StudentsListComponent } from './student/students-list/students-list.component';
import { StudentFormComponent } from './student/student-form/student-form.component';
import { AddStudentComponent } from './student/add-student/add-student.component';
import { EditStudentComponent } from './student/edit-student/edit-student.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { NavbarComponent } from './partials/navbar/navbar.component';
import { ProjectFormComponent } from './project/project-form/project-form.component';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DetailsProjectComponent } from './project/details-project/details-project.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './auth/interceptor';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './home/about.component';
import { ProjectSkillsComponent } from './project/project-skills/project-skills.component';
import { ProjectJoinComponent } from './project/project-join/project-join.component';

@NgModule({
  declarations: [
    AppComponent,
    TeacherListComponent,
    TeacherFormComponent,
    AddTeacherComponent,
    EditTeacherComponent,
    StudentsListComponent,
    StudentFormComponent,
    AddStudentComponent,
    EditStudentComponent,
    SidebarComponent,
    NavbarComponent,
    ProjectFormComponent,
    AddProjectComponent,
    ProjectListComponent,
    DetailsProjectComponent,
    LoginComponent,
    HomeComponent,
    AboutComponent,
    ProjectSkillsComponent,
    ProjectJoinComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
