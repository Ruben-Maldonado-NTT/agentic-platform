import { Component } from '@angular/core';
import { DrawFlowBaseNode } from '@ng-draw-flow/core';

@Component({
  selector: 'app-agent-node',
  templateUrl: './agent-node.component.html',
  styleUrls: ['./agent-node.component.css']
})
export class AgentNodeComponent extends DrawFlowBaseNode {

    ngOnInit() {
        console.log('🚀 Nodo cargado:', this.model);
    }
}
