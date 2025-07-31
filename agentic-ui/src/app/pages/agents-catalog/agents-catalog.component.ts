import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agents-catalog',
  templateUrl: './agents-catalog.component.html'
})
export class AgentsCatalogComponent implements OnInit {
  agents: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/mocks/agents.json').subscribe(data => {
      this.agents = data;
    });
  }

  viewAgent(agent: any) {
    alert(`Agente: ${agent.name}`);
  }

  copyAgent(agent: any) {
    alert(`Agente copiado: ${agent.name}`);
  }

  useAgent(agent: any) {
    alert(`Agente utilizado en nueva agencia: ${agent.name}`);
  }
}
