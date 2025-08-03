import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DfDataModel, DfConnectionPoint } from '@ng-draw-flow/core';
import { FlowModelService } from './flow-model.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Agency } from '../../models/agency.model';
import { Agent } from '../../models/agent.model';
import type { ExtendedDfNode, ExtendedDfDataModel } from './flow-model.types';
import type { DfDataConnector } from '@ng-draw-flow/core';


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
  
  editAgencyId: string | null = null;
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
  projectId: string | null = null;
  isNewProject = false;
  isEditMode = false
  connectingFrom: string | null = null;


  constructor(private http: HttpClient, 
              private route: ActivatedRoute,
              private router: Router,
              public flowService: FlowModelService) {}

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      this.projectId = this.route.snapshot.paramMap.get('projectId');
      this.isEditMode = this.route.snapshot.routeConfig?.path?.includes('edit');
      this.isNewProject = segments.some(s => s.path === 'new');
    });

    if (this.isEditMode && this.projectId) {
      this.loadProjectDesign(this.projectId);
    }

    if (this.isNewProject) {
      console.log('🆕 Modo creación de proyecto', this.projectId);
    }

    this.flowService.agencyDeleteRequested$.subscribe(({ id, name }) => {
      console.log('Event Delete received:', id, name);

      this.openDeleteAgencyModal(id, name);
    });
    
    this.flowService.agencyEditRequested$.subscribe(({ id, name }) => {
      console.log('Event Edit received:', id, name);

      this.onEditAgencyRequested(id, name);
    });
    
    
    this.flowService.agentRemoved$.subscribe(({ id }) => {
      console.log('Event Remove agent received:', id);
      this.removeAgentById(id);
    });

    this.http.get<any[]>('/assets/mocks/agent-templates.json').subscribe({
      next: (data) => {
        this.availableAgents = data || [];
      },
      error: (err) => {
        console.error('❌ Error al cargar plantillas:', err);
      }
    });

    this.updateAndSyncModel(this.form.value!)
  }

  loadProjectDesign(id: string): void {
    const stored = localStorage.getItem('projects');
    const projects = stored ? JSON.parse(stored) : [];
  
    const project = projects.find((p: any) => p.id === id);
    if (project?.design) {
      this.updateAndSyncModel(project.design);

      console.log('🎨 Loaded design for project:', project.name);
    } else {
      console.warn('⚠️ Project not found or has no design:', id);
    }
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

  openAgencyNameModal(existingAgency?: { id: string, name: string }) {
    this.newAgencyName = existingAgency?.name || '';
    this.editAgencyId = existingAgency?.id || null;
    this.showAgencyNameModal = true;
  }

  removeAgentById(agentId: string): void {
    const model = this.flowService.getModel(); // ✅ modelo real
    const updatedNodes = model.nodes.filter(n => n.id !== agentId);
    const updatedModel = { ...model, nodes: updatedNodes };
  
    this.updateAndSyncModel(updatedModel);
  
    console.log('[Designer] Removed agent:', agentId);
  }
  
  closeAgencyNameModal() {
    this.showAgencyNameModal = false;
    this.editAgencyId = null;
  }

  deleteAgency(id: string) {
    const updated = {
      ...this.form.value,
      nodes: this.form.value.nodes.filter(n =>
        n.id !== id && ('group' in n ? n.group !== id : true)
      )
    };

    this.updateAndSyncModel(updated);

    this.currentAgencies = updated.nodes
      .filter(n => n.data?.type === 'agencyGroup')
      .map(n => ({ id: n.id, name: n.data.name }));
  }

  confirmAgencyName(): void {
    if (!this.newAgencyName.trim()) return;
  
    const model = this.flowService.getModel() as ExtendedDfDataModel;
    let updatedNodes: ExtendedDfNode[] = model.nodes;
  
    if (this.editAgencyId) {
      // ✏️ Editar agencia existente
      updatedNodes = model.nodes.map(node => {
        if (node.id === this.editAgencyId && node.data?.type === 'agencyGroup') {
          return {
            ...node,
            data: {
              ...node.data,
              name: this.newAgencyName.trim()
            },
            connectors: this.createConnectors(node.id)
          };
        }
        return node;
      });
    } else {
      // ➕ Crear nueva agencia
      const agencyId = crypto.randomUUID();
      const newNode: ExtendedDfNode = {
        id: agencyId,
        component: 'agencyGroup',
        position: {
          x: 100 + Math.random() * 200,
          y: 100 + Math.random() * 200
        },
        data: {
          name: this.newAgencyName.trim(),
          type: 'agencyGroup',
          highlight: true
        },
        connectors: this.createConnectors(agencyId)
      };
  
      updatedNodes = [...model.nodes, newNode];
    }
  
    const updatedModel: ExtendedDfDataModel = {
      ...model,
      nodes: updatedNodes
    };
  
    // 💥 Forzamos refresco visual del canvas
    this.updateAndSyncModel({ nodes: [], connections: [] });
  
    setTimeout(() => {
      this.updateAndSyncModel(updatedModel);
  
      // ⏹️ Eliminamos el highlight para mostrar estado "estable"
      setTimeout(() => {
        const cleanNodes = updatedModel.nodes.map(n =>
          n.data?.highlight
            ? { ...n, data: { ...n.data, highlight: false } }
            : n
        );
        this.updateAndSyncModel({ ...updatedModel, nodes: cleanNodes });
      }, 800);
    }, 0);
  
    // 🔄 Actualizamos la lista de agencias visibles en formularios
    this.currentAgencies = updatedNodes
      .filter(n => n.data?.type === 'agencyGroup')
      .map(n => ({ id: n.id, name: n.data.name || '(unnamed)' }));
  
    this.closeAgencyNameModal();
    this.editAgencyId = null;
    this.newAgencyName = '';
  }
  
  onEditAgencyRequested(id: string, name: string) {
    this.openAgencyNameModal({id, name});
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
  
    // ❌ Si no se ha seleccionado agencia, cancela
    if (!agencyId) {
      alert('Debes seleccionar una agencia para agregar agentes.');
      return;
    }
  
    const agencyNode = model.nodes.find(
      n => n.id === agencyId && n.data?.type === 'agencyGroup'
    );
  
    if (!agencyNode) {
      console.warn('No se encontró la agencia seleccionada:', agencyId);
      return;
    }
  
    // Calculamos posición base cerca de la agencia
    let baseX = 100 + Math.random() * 300;
    let baseY = 100 + Math.random() * 300;
  
    if ('position' in agencyNode && agencyNode.position) {
      baseX = agencyNode.position.x + 60;
      baseY = agencyNode.position.y + 80;
    }
  
    const newNodes = [];
    let counter = 0;
  
    for (const agentId of this.selectedAgentIds) {
      const template = this.availableAgents.find(a => a.id === agentId);
      if (!template) continue;
  
      const nodeId = `agent-${this.nodeCounter++}`;
  
      const newNode = {
        id: nodeId,
        group: agencyId, // 👈 asegura que va dentro de la agencia
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
  
      newNodes.push(newNode);
      counter++;
    }
  
    // 🔁 Solo actualiza el modelo si hay nodos nuevos
    if (newNodes.length > 0) {
      const updatedModel = {
        ...model,
        nodes: [...model.nodes, ...newNodes]
      };
      this.updateAndSyncModel(updatedModel);
    }
  
    this.closeAgentSelectorModal();
  }
  


  addAgency(name: string): void {
    const model = this.flowService.getModel();
    const newId = `agency-${this.nodeCounter++}`;
    const x = 50 + Math.random() * 200;
    const y = 50 + Math.random() * 200;
  
    const agencyNode = {
      id: newId,
      position: { x, y },
      data: {
        type: 'agencyGroup',
        name
      }
    };
  
    const updatedModel = {
      ...model,
      nodes: [...model.nodes, agencyNode]
    };
  
    this.updateAndSyncModel(updatedModel);
  
    this.currentAgencies.push({ id: newId, name });
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
      console.log('🟢 Agent Node selected:', node);
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
      this.updateAndSyncModel(newModel);
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
    this.updateAndSyncModel(newModel);

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

  exportAgencyJson(): void {
    const model = this.flowService.getModel(); // ✅ Ya lo has hecho así
    console.log('[Export] Nodes:', model.nodes.map(n => n.id));
  
    const json = JSON.stringify(model, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agency.json';
    a.click();
  
    URL.revokeObjectURL(url);
  }

  onImportAgencyJson(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
  
    const file = input.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      try {
        const content = reader.result as string;
        const parsed = JSON.parse(content);
  
        if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
          throw new Error('Invalid format: missing "nodes"');
        }
  
        const fullModel = JSON.parse(JSON.stringify(parsed));
  
        const onlyNodesModel = {
          ...fullModel,
          connections: [] // elimina conexiones temporalmente
        };
  
        // Fase 1: carga nodos sin conexiones
        this.updateAndSyncModel(onlyNodesModel);
  
        // Fase 2: tras delay, carga conexiones
        setTimeout(() => {
          this.updateAndSyncModel(fullModel);
  
          this.currentAgencies = fullModel.nodes
            .filter((n: any) => n.data?.type === 'agencyGroup')
            .map((n: any) => ({ id: n.id, name: n.data.name }));
        }, 100); // puedes ajustar el delay si es necesario
  
      } catch (err) {
        console.error('[Import JSON] Error processing the file:', err);
        alert('Invalid agency JSON.');
      }
    };
  
    reader.readAsText(file);
  }
  
  

  saveNewProject(): void {
    const model = this.form.value!;
    const newProject = {
      id: this.projectId,
      name: `Proyecto ${new Date().toLocaleDateString()}`,
      agencies: model.nodes.filter(n => n.data?.type === 'agencyGroup').length,
      state: 'activo',
      design: model
    };
  
    console.log('💾 Proyecto guardado:', newProject);
  
    // Aquí puedes:
    // - Guardarlo en localStorage
    // - Enviar a un backend simulado
    // - Emitirlo a un servicio compartido
  
    alert('✅ Proyecto guardado correctamente');
  
    this.router.navigate(['/projects']);
  }
  private updateAndSyncModel(model: DfDataModel): void {
    this.flowService.setModel(model);
    this.form.setValue(model); // sincroniza el canvas
  }  
  createConnectors(nodeId: string): { [key: string]: DfDataConnector } {
    const connectorIn: DfDataConnector = {
      nodeId,
      connectorId: `${nodeId}-in`,
      connectorType: 'input' as DfConnectionPoint
    };
  
    const connectorOut: DfDataConnector = {
      nodeId,
      connectorId: `${nodeId}-out`,
      connectorType: 'output' as DfConnectionPoint
    };
  
    return {
      in: connectorIn,
      out: connectorOut
    };
  }
  handleStartConnection(fromAgencyId: string) {
    console.log('[DesignerComponent] Starting connection from:', fromAgencyId);
    this.connectingFrom = fromAgencyId;
  }
  
  handleAgencyClicked(targetAgencyId: string): void {
    console.log('[DesignerComponent] Agency clicked:', targetAgencyId);
    if (!this.connectingFrom || this.connectingFrom === targetAgencyId) {
      this.connectingFrom = null;
      return;
    }
  
    const model = this.flowService.getModel();
  
    const sourceNode = model.nodes.find(n => n.id === this.connectingFrom) as ExtendedDfNode;
    const targetNode = model.nodes.find(n => n.id === targetAgencyId) as ExtendedDfNode;
  
    if (!sourceNode || !targetNode || !sourceNode.connectors?.out || !targetNode.connectors?.in) {
      console.warn('❌ No se encontraron conectores válidos para conexión.');
      this.connectingFrom = null;
      return;
    }
  
    const newConnection = {
      source: sourceNode.connectors.out,
      target: targetNode.connectors.in
    };
  
    const updatedModel = {
      ...model,
      connections: [...model.connections, newConnection]
    };
  
    this.updateAndSyncModel(updatedModel);
    this.connectingFrom = null;
  }
  
}
