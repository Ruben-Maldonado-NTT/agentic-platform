import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';

import { DrawFlowBaseNode } from '@ng-draw-flow/core';
import { FlowModelService } from '../flow-model.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agency-group',
  templateUrl: './agency-group.component.html',
  styleUrls: ['./agency-group.component.css']
})
export class AgencyGroupComponent extends DrawFlowBaseNode implements OnInit, OnDestroy {
  @Input() name: string = '';
  @Input() model: any;  // contiene el { name, type }
  @Input() nodeId: string = '';

  @Output() editRequested = new EventEmitter<{ id: string, name: string }>();
  @Output() delete = new EventEmitter<{ id: string; name: string }>();
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
}
