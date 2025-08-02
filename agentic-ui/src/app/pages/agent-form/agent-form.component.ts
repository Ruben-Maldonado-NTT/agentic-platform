import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-agent-form',
  templateUrl: './agent-form.component.html',
  styleUrls: ['./agent-form.component.css']
})
export class AgentFormComponent {
  agentForm: FormGroup;
  agents: any[] = [];
  isEditMode: boolean = false;
  editingAgentId: string | null = null;
  
  ngOnInit(): void {
    const agentId = this.route.snapshot.paramMap.get('id');
    const stored = localStorage.getItem('agents');
    this.agents = stored ? JSON.parse(stored) : [];
    if (agentId) {
      this.isEditMode = true;
      this.loadAgent(agentId);
    } else {
      this.isEditMode = false;
    }

  }

  constructor(private fb: FormBuilder, 
              private router: Router,
              private route: ActivatedRoute) {
    this.agentForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      status: ['active', Validators.required],
      description: ['']
    });
  }

  onSave(): void {
    if (this.agentForm.invalid) return;
  
    const agentsRaw = localStorage.getItem('agents');
    const agents = agentsRaw ? JSON.parse(agentsRaw) : [];
  
    if (this.isEditMode && this.editingAgentId) {
      const index = agents.findIndex((a: any) => a.id === this.editingAgentId);
      if (index !== -1) {
        agents[index] = { ...agents[index], ...this.agentForm.value };
      }
    } else {
      const newAgent = {
        ...this.agentForm.value,
        id: `agent-${Date.now()}`
      };
      agents.push(newAgent);
    }
  
    localStorage.setItem('agents', JSON.stringify(agents));
    this.router.navigate(['/agents']);
  }
  
  loadAgent(id: string): void {
    const stored = localStorage.getItem('agents');
    console.log('Loading agents stored:', stored);
    const agents = stored ? JSON.parse(stored) : [];
  
    const agent = agents.find((a: any) => a.id === id);
    if (agent) {
      this.agentForm.patchValue(agent);
      this.editingAgentId = id;
    } else {
      alert('Agent not found');
      this.router.navigate(['/agents']);
    }
  }
  
  onCancel(): void {
    this.router.navigate(['/agents']);
  }
}
