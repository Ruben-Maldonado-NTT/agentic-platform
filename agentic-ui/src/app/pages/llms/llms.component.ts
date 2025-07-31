import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-llms',
  templateUrl: './llms.component.html'
})
export class LlmsComponent implements OnInit {
  llms: any[] = [];
  defaultLlm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/mocks/llms.json').subscribe((data) => {
      this.llms = data;
      const defaultAvailable = this.llms.find(llm => llm.status === 'disponible');
      if (defaultAvailable) this.defaultLlm = defaultAvailable.id;
    });
  }

  setDefaultLlm(llmId: string) {
    this.defaultLlm = llmId;
    alert(`Modelo por defecto actualizado a: ${llmId}`);
  }
}
