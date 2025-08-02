import { Component, Input } from '@angular/core';
import { DrawFlowBaseNode } from '@ng-draw-flow/core';

@Component({
  selector: 'df-node-agentEmbedded',
  templateUrl: './agent-embedded.component.html',
  styleUrls: ['./agent-embedded.component.css']
})
export class AgentEmbeddedComponent extends DrawFlowBaseNode {
  @Input() data: any;
  @Input() nodeId: string = '';
}
