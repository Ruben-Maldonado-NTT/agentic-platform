import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  this.http.get<any[]>('/assets/mocks/projects.json').subscribe({
    next: (data) => {
      console.log('📦 Proyectos cargados:', data);
      this.projects = data;
    },
    error: (err) => {
      console.error('❌ Error al cargar proyectos:', err);
    }
  });
}


  viewProject(project: any) {
    alert(`Ver proyecto: ${project.name}`);
  }

  editProject(project: any) {
    alert(`Editar proyecto: ${project.name}`);
  }

  deleteProject(project: any) {
    const confirmed = confirm(`¿Eliminar proyecto: ${project.name}?`);
    if (confirmed) {
      this.projects = this.projects.filter(p => p.id !== project.id);
    }
  }
}
