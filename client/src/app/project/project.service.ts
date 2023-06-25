import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Project } from './project';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private url = 'http://localhost:7001';
  private projects$: Subject<Project[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshProjects() {
    this.httpClient
      .get<Project[]>(`${this.url}/api/projects`)
      .subscribe((projects) => {
        this.projects$.next(projects);
      });
  }

  getProjects(): Subject<Project[]> {
    this.refreshProjects();
    return this.projects$;
  }

  getProject(id: string): Observable<Project> {
    return this.httpClient.get<Project>(`${this.url}/api/projects/${id}`);
  }

  createProject(project: Project): Observable<string> {
    return this.httpClient.post(`${this.url}/api/projects`, project, { responseType: 'text' });
  }

  updateProject(id: string, project: Project): Observable<string> {
    return this.httpClient.put(`${this.url}/api/projects/${id}`, project, { responseType: 'text' });
  }

  deleteProject(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/api/projects/${id}`, { responseType: 'text' });
  }
}
