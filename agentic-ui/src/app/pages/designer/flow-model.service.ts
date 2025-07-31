import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DfDataModel } from '@ng-draw-flow/core';

@Injectable({ providedIn: 'root' })
export class FlowModelService {
  private model$ = new BehaviorSubject<DfDataModel>({ nodes: [], connections: [] });
  modelValue$ = this.model$.asObservable();

  setModel(model: DfDataModel) {
    this.model$.next(model);
  }

  getModel(): DfDataModel {
    return this.model$.getValue();
  }
}
