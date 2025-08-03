import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DfDataModel } from '@ng-draw-flow/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlowModelService {
  private model$ = new BehaviorSubject<DfDataModel>({ nodes: [], connections: [] });
  public agencyDeleteRequested$ = new Subject<{ id: string; name: string }>();
  public agencyEditRequested$ = new Subject<{ id: string; name: string }>();
  public agentRemoved$ = new Subject<{ id: string}>();
  private _model: DfDataModel = { nodes: [], connections: [] };
  private modelValueSubject = new BehaviorSubject<DfDataModel>({ nodes: [], connections:[] });
  modelValue$ = this.modelValueSubject.asObservable();

  setModel(model: DfDataModel) {
    this.modelValueSubject.next(model);
  }

  getModel(): DfDataModel {
    return this.modelValueSubject.getValue();
  }

  get currentModelValue(): DfDataModel {
    return this._model;
  }
}
