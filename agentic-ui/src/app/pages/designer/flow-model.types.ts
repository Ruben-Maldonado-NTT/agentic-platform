import type { DfDataModel, DfDataConnector, DfPoint } from '@ng-draw-flow/core';

export interface ExtendedDfNode {
  id: string;
  component: string;
  data: {
    name: string;
    type: string;
    [key: string]: any;
  };
  position: DfPoint;
  startNode?: boolean;
  endNode?: boolean;
  connectors?: {
    [key: string]: DfDataConnector;
  };
}

export interface ExtendedDfDataModel extends DfDataModel {
  nodes: ExtendedDfNode[];
}
