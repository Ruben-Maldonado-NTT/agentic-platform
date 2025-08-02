import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  selectedProjectToDelete: any = null;
  showDeleteModal = false;


  constructor(private router: Router, private http: HttpClient) {}

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

  toggleProjectStatus(project: any): void {
    if (project.status === 'active') {
      project.status = 'inactive';
    } else {
      project.status = 'active';
    }
  
    // 🧠 Si usas localStorage o servicio, actualízalo allí también
    console.log(`📌 Project ${project.id} changed to: ${project.status}`);
  }
  
  createNewProject(): void {
    const newProjectId = crypto.randomUUID(); // o un contador si lo prefieres
    this.router.navigate(['/designer', newProjectId, 'new']);
  }

  viewProject(project: any) {
    alert(`Ver proyecto: ${project.name}`);
  }

  editProject(project: any): void {

    this.router.navigate(['/designer', project.id, 'edit']);
  }

  deleteProject(project: any) {
    const confirmed = confirm(`¿Eliminar proyecto: ${project.name}?`);
    if (confirmed) {
      this.projects = this.projects.filter(p => p.id !== project.id);
    }
  }
  
  openDeleteModal(project: any): void {
    this.selectedProjectToDelete = project;
    this.showDeleteModal = true;
  }
  
  closeDeleteModal(): void {
    this.selectedProjectToDelete = null;
    this.showDeleteModal = false;
  }
  
  confirmDeleteProject(): void {
    if (!this.selectedProjectToDelete) return;
  
    const projectId = this.selectedProjectToDelete.id;
    this.projects = this.projects.filter(p => p.id !== projectId);
  
    // Optional: update localStorage or API
    localStorage.setItem('projects', JSON.stringify(this.projects));
  
    this.closeDeleteModal();
  }
  
}
