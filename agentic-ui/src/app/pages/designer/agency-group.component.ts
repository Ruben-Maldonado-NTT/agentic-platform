import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { DrawFlowBaseNode } from '@ng-draw-flow/core';
import { FlowModelService } from './flow-model.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agency-group',
  templateUrl: './agency-group.component.html',
  styleUrls: ['./agency-group.component.css']
})
export class AgencyGroupComponent extends DrawFlowBaseNode implements OnInit, OnDestroy {
  childAgents: any[] = [];
  private sub!: Subscription;

  constructor(
    private flowModel: FlowModelService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.sub = this.flowModel.modelValue$.subscribe(model => {
      this.childAgents = (model.nodes || []).filter(
        (n: any) =>
          (n.data?.type === 'agentNode' || n.data?.type === 'agentEmbedded') &&
          n.data?.agencyId === this.nodeId
      );
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
