import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { Skill } from './skill';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private url = 'http://localhost:7001';
  private skills$: Subject<Skill[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshSkills() {
    this.httpClient
      .get<Skill[]>(`${this.url}/api/skills`)
      .subscribe((skills) => {
        this.skills$.next(skills);
      });
  }

  getSkills(): Subject<Skill[]> {
    this.refreshSkills();
    return this.skills$;
  }

  getSkill(id: string): Observable<Skill> {
    return this.httpClient.get<Skill>(`${this.url}/api/skills/${id}`);
  }

  createSkill(skill: Skill): Observable<string> {
    return this.httpClient.post(`${this.url}/api/skills`, skill, { responseType: 'text' });
  }

  updateSkill(id: string, skill: Skill): Observable<string> {
    return this.httpClient.put(`${this.url}/api/skills/${id}`, skill, { responseType: 'text' });
  }

  deleteSkill(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/api/skills/${id}`, { responseType: 'text' });
  }

  getSkillsByIds(skillIds: string[]): Observable<Skill[]> {
    return this.httpClient.get<Skill[]>(`${this.url}/api/skills/`).pipe(
      map((skills: Skill[]) => {
        return skills.filter((skill: Skill) => skillIds.includes(skill._id));
      })
    );
  }
}