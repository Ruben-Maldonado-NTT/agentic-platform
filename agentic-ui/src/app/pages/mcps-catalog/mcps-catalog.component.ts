import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mcps-catalog',
  templateUrl: './mcps-catalog.component.html'
})
export class McpsCatalogComponent implements OnInit {
  mcps: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/mocks/mcps.json').subscribe(data => {
      this.mcps = data;
    });
  }

  viewMcp(mcp: any) {
    alert(`Ver MCP: ${mcp.name}`);
  }

  testMcp(mcp: any) {
    alert(`Probar MCP: ${mcp.name}`);
  }

  assignMcp(mcp: any) {
    alert(`Asignar MCP: ${mcp.name}`);
  }
}
