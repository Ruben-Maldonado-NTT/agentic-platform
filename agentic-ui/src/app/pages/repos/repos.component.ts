import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html'
})
export class ReposComponent implements OnInit {
  repos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/mocks/repos.json').subscribe(data => {
      this.repos = data;
    });
  }

  viewRepo(repo: any) {
    window.open(repo.url, '_blank');
  }

  cloneRepo(repo: any) {
    alert(`Clonando repositorio: git clone ${repo.url}`);
  }

  downloadRepo(repo: any) {
    alert(`Descargando ZIP de: ${repo.name}`);
  }
}
