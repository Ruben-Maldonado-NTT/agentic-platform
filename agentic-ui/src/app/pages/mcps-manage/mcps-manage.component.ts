import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mcps-manage',
  templateUrl: './mcps-manage.component.html'
})
export class McpsManageComponent implements OnInit {
  mcps: any[] = [];
  newMcp = { name: '', type: '', status: 'activo' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/mocks/mcps.json').subscribe(data => {
      this.mcps = data;
    });
  }

  addMcp() {
    if (this.newMcp.name && this.newMcp.type) {
      const mcp = { ...this.newMcp, id: 'mcp-' + (this.mcps.length + 1) };
      this.mcps.push(mcp);
      this.newMcp = { name: '', type: '', status: 'activo' };
    }
  }

  deleteMcp(mcp: any) {
    this.mcps = this.mcps.filter(x => x.id !== mcp.id);
  }
}
