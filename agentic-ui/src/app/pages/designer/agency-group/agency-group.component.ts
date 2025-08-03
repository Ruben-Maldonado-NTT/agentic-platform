import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { EventEmitter, Input, Output,SimpleChanges } from '@angular/core';
import { DfInputComponent, DfOutputComponent, DfDataNode } from '@ng-draw-flow/core';

import { DrawFlowBaseNode } from '@ng-draw-flow/core';
import { FlowModelService } from '../flow-model.service';
import { Subscription } from 'rxjs';
import { Agency } from '../../../models/agency.model';

@Component({
  selector: 'app-agency-group',
  templateUrl: './agency-group.component.html',
  styleUrls: ['./agency-group.component.css']
})
export class AgencyGroupComponent extends DrawFlowBaseNode implements OnInit, OnDestroy {
  @Input() name: string = '';
  @Input() model: any;  // contiene el { name, type }
  @Input() nodeId: string = '';
  @Input() allNodes: DfDataNode[] = [];

  @Output() agentRemoved = new EventEmitter<{ id: string, name: string }>();
  @Output() editRequested = new EventEmitter<{ id: string, name: string }>();
  @Output() delete = new EventEmitter<{ id: string; name: string }>();
  @Output() startConnection = new EventEmitter<string>();
  @Output() agencyClicked = new EventEmitter<string>();

  childAgents: any[] = [];
  private sub!: Subscription;

  constructor(
    private flowService: FlowModelService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    console.log('[AgencyGroupComponent] model recibido:', this.model);

    this.sub = this.flowService.modelValue$.subscribe(model => {
      this.childAgents = (model.nodes || []).filter(
        (n: any) =>
          (n.data?.type === 'agentNode' || n.data?.type === 'agentEmbedded') &&
          n.data?.agencyId === this.nodeId
      );
      this.cd.detectChanges();
    });
  }

  emitDelete() {
    const id = this.nodeId;
    const name = this.model.name;
    if (id && name) {
      this.flowService.agencyDeleteRequested$.next({ id, name });
    } else {
      console.warn('[AgencyGroupComponent] No se pudo emitir delete: id o name faltan', {
        id,
        name,
        model: this.model
      });
    }
  }
  
  onEditAgency() {
    const id = this.nodeId;
    const name = this.model.name;
    if (id && name) {
      this.flowService.agencyEditRequested$.next({ id, name });
    } else {
      console.warn('[AgencyGroupComponent] No se pudo emitir edit: id o name faltan', {
        id,
        name,
        model: this.model
      });
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
  
  removeAgentFromAgency(agentId: string) {
    console.log('[AgencyGroupComponent] Removing agent:', agentId);

    const id = this.nodeId;
    const name = this.model.name;
    if (id && name) {
      this.flowService.agentRemoved$.next({ id: agentId});
    } else {
      console.warn('[AgencyGroupComponent] No se pudo emitir remove: id o name faltan', {
        id,
        name,
        model: this.model
      });
    }
  }

  onStartConnection() {
    console.log('[AgencyGroupComponent] Starting connection from node:', this.nodeId);
    this.startConnection.emit(this.nodeId);  // nodeId ya lo tienes
  }
  
  onAgencyClick() {
    console.log('[AgencyGroupComponent] Agency clicked:', this.nodeId);
    this.agencyClicked.emit(this.nodeId);  // para detectar clics normales
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.allNodes || changes.model) {
      const agencyId = this.model?.id;
      this.childAgents = this.allNodes.filter(n => n.data?.agencyId === agencyId);
    }
  }
}
