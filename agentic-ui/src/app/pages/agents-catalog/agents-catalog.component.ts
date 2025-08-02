import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-agents-catalog',
  templateUrl: './agents-catalog.component.html'
})
export class AgentsCatalogComponent implements OnInit {
  agents: any[] = [];
  selectedAgentToDelete: any = null;
  showDeleteModal: boolean = false;


  constructor(private router: Router,
              private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/mocks/agents.json').subscribe(data => {
      this.agents = data;
    });
  }

  createNewAgent(): void {
    this.router.navigate(['/agents/new']);
  }

  editAgent(agent: any) {
    this.router.navigate(['/agents', agent.id, 'edit']);
  }

  openDeleteModal(agent: any): void {
    this.selectedAgentToDelete = agent;
    this.showDeleteModal = true;
  }
  
  closeDeleteModal(): void {
    this.selectedAgentToDelete = null;
    this.showDeleteModal = false;
  }
  
  confirmDeleteAgent(): void {
    const agentId = this.selectedAgentToDelete?.id;
    if (!agentId) return;
  
    const stored = localStorage.getItem('agents');
    const agents = stored ? JSON.parse(stored) : [];
    const updatedAgents = agents.filter((a: any) => a.id !== agentId);
    localStorage.setItem('agents', JSON.stringify(updatedAgents));
  
    // Refrescar lista local
    this.agents = updatedAgents;
    this.closeDeleteModal();
  }
  
}
