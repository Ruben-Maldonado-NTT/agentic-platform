import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  DfDataModel,
  DfConnectionPoint
} from '@ng-draw-flow/core';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent implements OnInit {
  form = new FormControl<DfDataModel>({
    nodes: [],
    connections: []
  });

  availableAgents: any[] = [];
  nodeCounter = 0;
  currentAgencies: { id: string; name: string }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/mocks/agent-templates.json').subscribe({
      next: (data) => {
        console.log('✅ Agentes cargados:', data);
        this.availableAgents = data || [];
      },
      error: (err) => {
        console.error('❌ Error al cargar agent-templates.json:', err);
      }
    });
  }

  addAgent(agentTemplate: any): void {
    if (!agentTemplate || !agentTemplate.name) {
      console.warn('⚠️ Template inválido:', agentTemplate);
      return;
    }

    const newId = `node-${this.nodeCounter++}`;
    const x = 100 + Math.random() * 300;
    const y = 100 + Math.random() * 300;

    const newNode = {
      id: newId,
      position: { x, y },
      data: {
        type: 'agentNode', // ← debe coincidir exactamente con el tipo registrado en providers
        name: agentTemplate.name,
        role: agentTemplate.role,
        agencyId: agentTemplate.selectedAgency || null
      }
    };

    const currentModel = this.form.value || { nodes: [], connections: [] };
    currentModel.nodes = [...(currentModel.nodes || []), newNode];

    // Conexión automática con nodo anterior
    if (currentModel.nodes.length > 1) {
      const previousNode = currentModel.nodes[currentModel.nodes.length - 2];
      const connection = {
        source: {
          nodeId: previousNode.id,
          connectorType: DfConnectionPoint.Output,
          connectorId: `${previousNode.id}-out`
        },
        target: {
          nodeId: newId,
          connectorType: DfConnectionPoint.Input,
          connectorId: `${newId}-in`
        }
      };
      currentModel.connections = [...(currentModel.connections || []), connection];
    }

    this.form.setValue(currentModel);
  }

  addAgency(name: string): void {
    const newId = `agency-${this.nodeCounter++}`;
    const x = 50 + Math.random() * 200;
    const y = 50 + Math.random() * 200;

    this.currentAgencies.push({ id: newId, name });

    const agencyNode = {
      id: newId,
      position: { x, y },
      data: {
        type: 'agencyGroup',
        name
      }
    };

    const model = this.form.value || { nodes: [], connections: [] };
    model.nodes = [...(model.nodes || []), agencyNode];
    this.form.setValue(model);
  }


  exportJSON(): void {
    const json = this.form.value;
    console.log('📤 agency.json:\n', JSON.stringify(json, null, 2));
  }
}
