import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DfDataModel } from '@ng-draw-flow/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlowModelService {
  private model$ = new BehaviorSubject<DfDataModel>({ nodes: [], connections: [] });
  public agencyDeleteRequested$ = new Subject<{ id: string; name: string }>();

  modelValue$ = this.model$.asObservable();

  setModel(model: DfDataModel) {
    this.model$.next(model);
  }

  getModel(): DfDataModel {
    return this.model$.getValue();
  }
}
