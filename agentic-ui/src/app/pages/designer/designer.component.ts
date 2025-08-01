import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DfDataModel, DfConnectionPoint } from '@ng-draw-flow/core';
import { FlowModelService } from './flow-model.service';

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
  currentAgencies: { id: string; name: string }[] = [];
  nodeCounter = 0;
  selectedNode: any = null;
  showAgentSelectorModal = false;
  agentSearchQuery = '';
  selectedAgentIds: string[] = [];
  selectedAgencyForAgents: string | null = null;
  showAgencyNameModal = false;
  newAgencyName: string = '';
  showDeleteAgencyModal = false;
  agencyToDelete: { id: string; name: string } | null = null;

  constructor(private http: HttpClient, private flowService: FlowModelService) {}

  ngOnInit(): void {
    this.flowService.agencyDeleteRequested$.subscribe(({ id, name }) => {
      console.log('Evento recibido:', id, name);

      this.openDeleteAgencyModal(id, name);
    });
    this.http.get<any[]>('/assets/mocks/agent-templates.json').subscribe({
      next: (data) => {
        this.availableAgents = data || [];
      },
      error: (err) => {
        console.error('❌ Error al cargar plantillas:', err);
      }
    });

    this.flowService.setModel(this.form.value!);
  }
  confirmDeleteAgency() {
    if (!this.agencyToDelete) return;

    this.deleteAgency(this.agencyToDelete.id);
    this.closeDeleteAgencyModal();
  }

  openDeleteAgencyModal(id: string, name: string) {
    this.agencyToDelete = { id, name };
    this.showDeleteAgencyModal = true;
  }

  closeDeleteAgencyModal() {
    this.showDeleteAgencyModal = false;
    this.agencyToDelete = null;
  }

  openAgencyNameModal() {
    this.newAgencyName = '';
    this.showAgencyNameModal = true;
  }

  closeAgencyNameModal() {
    this.showAgencyNameModal = false;
  }
  deleteAgency(id: string) {
    const updated = {
      ...this.form.value,
      nodes: this.form.value.nodes.filter(n =>
        n.id !== id && ('group' in n ? n.group !== id : true)
      )
    };

    this.form.setValue(updated);

    this.currentAgencies = updated.nodes
      .filter(n => n.data?.type === 'agencyGroup')
      .map(n => ({ id: n.id, name: n.data.name }));
  }

  confirmAgencyName() {
    if (!this.newAgencyName.trim()) return;

    const agencyId = crypto.randomUUID();  // o tu método actual
    const node = {
      id: agencyId,
      data: {
        name: this.newAgencyName,
        type: 'agencyGroup'
      },
      position: {
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200
      }
    };

    const current = this.form.value;
    const updated = {
      ...current,
      nodes: [...current.nodes, node]
    };
    this.form.setValue(updated);
    this.currentAgencies = this.form.value.nodes
    .filter(n => n.data?.type === 'agencyGroup')
    .map(n => ({
      id: n.id,
      name: n.data.name || '(sin nombre)'
    }));
    this.closeAgencyNameModal();
  }

  openAgentSelectorModal(): void {
    this.showAgentSelectorModal = true;
    this.selectedAgentIds = []; // <-- Vacía la selección al abrir el modal
    this.selectedAgencyForAgents = null; // Opcional: resetea la agencia seleccionada
  }

  closeAgentSelectorModal(): void {
    this.showAgentSelectorModal = false;
  }

  addSelectedAgentsToAgency(): void {
    const model = this.form.value!;
    const agencyId = this.selectedAgencyForAgents;

    if (!agencyId) return;

    const agencyNode = model.nodes.find(
      n => n.id === agencyId && n.data?.type === 'agencyGroup'
    );

    let baseX = 100 + Math.random() * 300;
    let baseY = 100 + Math.random() * 300;

    if ((agencyNode as any)?.position) {
      baseX = (agencyNode as any).position.x + 60;
      baseY = (agencyNode as any).position.y + 80;
    }

    let counter = 0;
    this.selectedAgentIds.forEach(agentId => {
      const template = this.availableAgents.find(a => a.id === agentId);
      if (!template) return;

      const newNode = {
        id: `node-${this.nodeCounter++}`,
        position: {
          x: baseX + (counter % 2) * 120,
          y: baseY + Math.floor(counter / 2) * 100
        },
        data: {
          type: 'agentEmbedded',
          name: template.name,
          role: template.role,
          agencyId
        }
      };

      model.nodes.push(newNode);
      counter++;
    });

    const newModel = { ...model };
    this.form.setValue(newModel);
    this.flowService.setModel(newModel);
    this.closeAgentSelectorModal();
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

    const model = this.form.value!;
    model.nodes = [...model.nodes, agencyNode];
    const newModel = { ...model };
    this.form.setValue(newModel);
    this.flowService.setModel(newModel);
  }
  

  addAgent(agentTemplate: any): void {
    const model = this.form.value!;
    const newId = `node-${this.nodeCounter++}`;

    // Posición por defecto
    let x = 100 + Math.random() * 300;
    let y = 100 + Math.random() * 300;

    const hasAgency = !!agentTemplate.selectedAgency;

    // Si tiene agencia asignada → colócalo dentro
    if (hasAgency) {
      const agencyNode = model.nodes.find(
        n => n.id === agentTemplate.selectedAgency && n.data?.type === 'agencyGroup'
      );
      if ((agencyNode as any)?.position) {
        x = (agencyNode as any).position.x + 40 + Math.random() * 100;
        y = (agencyNode as any).position.y + 60 + Math.random() * 100;
      }
    }

    const newNode = {
      id: newId,
      position: { x, y },
      data: {
        type: 'agencyGroup', // ❗ este es el truco clave
        name: agentTemplate.name,
        role: agentTemplate.role,
        agencyId: agentTemplate.selectedAgency || null
      }
    };

    model.nodes = [...model.nodes, newNode];

    // Conexión automática
    if (model.nodes.length > 1) {
      const previous = model.nodes[model.nodes.length - 2];
      const connection = {
        source: {
          nodeId: previous.id,
          connectorType: DfConnectionPoint.Output,
          connectorId: `${previous.id}-out`
        },
        target: {
          nodeId: newId,
          connectorType: DfConnectionPoint.Input,
          connectorId: `${newId}-in`
        }
      };
      model.connections = [...model.connections, connection];
    }

    const newModel = { ...model };
    this.form.setValue(newModel);
    this.flowService.setModel(newModel);
  }


  onNodeSelected(event: any) {
    const nodeId = event?.id || event?.nodeId;

    if (!nodeId) {
      this.selectedNode = null;
      return;
    }

    const model = this.form.value!;
    const node = model.nodes.find(n => n.id === nodeId);

    if (node?.data?.type === 'agentNode') {
      console.log('🟢 Nodo agente seleccionado:', node);
      this.selectedNode = node;
    } else {
      this.selectedNode = null;
    }
  }


  updateNode() {
    const model = this.form.value!;
    const index = model.nodes.findIndex(n => n.id === this.selectedNode.id);
    if (index >= 0) {
      model.nodes[index] = this.selectedNode;
      const newModel = { ...model };
      this.form.setValue(newModel);
      this.flowService.setModel(newModel);
      this.selectedNode = null;
    }
  }

  onNodeMoved(event: { nodeId: string; dx: number; dy: number }) {
    const model = this.form.value!;
    const movedNode = model.nodes.find(n => n.id === event.nodeId);
    if (!movedNode || movedNode.data?.type !== 'agencyGroup') return;

    const agencyId = movedNode.id;

    model.nodes.forEach((node: any) => {
      if (
        node?.data?.agencyId === agencyId &&
        typeof node.position?.x === 'number' &&
        typeof node.position?.y === 'number'
      ) {
        node.position.x += event.dx;
        node.position.y += event.dy;
      }
    });

    const newModel = { ...model };
    this.form.setValue(newModel);
    this.flowService.setModel(newModel);
  }

  exportJSON(): void {
    console.log('📤 agency.json:\n', JSON.stringify(this.form.value, null, 2));
  }

  onAgentCheckboxChange(agentId: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedAgentIds.includes(agentId)) {
        this.selectedAgentIds.push(agentId);
      }
    } else {
      this.selectedAgentIds = this.selectedAgentIds.filter(id => id !== agentId);
    }
  }
  exportAgencyJson() {
    const model = this.form.value; // <- tu modelo completo de nodos/edges
    const json = JSON.stringify(model, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agency.json';
    a.click();
  
    URL.revokeObjectURL(url);
  }
  onImportAgencyJson(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const file = input.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      try {
        const content = reader.result as string;
        const parsed = JSON.parse(content);
  
        if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
          throw new Error('Formato inválido: falta "nodes"');
        }
  
        // 🔁 Paso 1: reset visual
        this.form.setValue({ nodes: [], connections: [] });

  
        // 🔁 Paso 2: forzar el nuevo valor en el siguiente tick
        setTimeout(() => {
          // ✅ Clonamos para romper referencia
          const model = JSON.parse(JSON.stringify(parsed));
          this.form.setValue(model);
  
          // 🔄 Refrescar lista lateral de agencias
          this.currentAgencies = model.nodes
            .filter((n: any) => n.data?.type === 'agencyGroup')
            .map((n: any) => ({ id: n.id, name: n.data.name }));
  
        }, 0);
  
      } catch (err) {
        console.error('[Importar JSON] Error al procesar archivo:', err);
        alert('El archivo no es un JSON válido de agencia.');
      }
    };
  
    reader.readAsText(file);
  }
  
  
  
}
