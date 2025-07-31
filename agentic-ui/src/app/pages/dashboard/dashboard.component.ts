import { Component } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexYAxis,
  ApexStroke,
  ApexFill,
  ApexTooltip
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  title?: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  metrics = {
    projects: 12,
    agencies: 5,
    agents: 27,
    errors: 2
  };

  agentByAgencyOptions: Partial<ChartOptions> = {
    series: [{
      name: "Agentes",
      data: [10, 7, 5, 3]
    }],
    chart: { type: "bar", height: 250 },
    xaxis: { categories: ["Agencia A", "Agencia B", "Agencia C", "Agencia D"] },
    title: { text: "Agentes por Agencia" }
  };

  trafficOptions: Partial<ChartOptions> = {
    series: [{
      name: "Mensajes",
      data: [31, 40, 28, 51, 42, 85, 77]
    }],
    chart: { type: "area", height: 250 },
    title: { text: "Tráfico A2A (última hora)" }
  };

  mcpUsageOptions = {
    series: [44, 33, 23],
    chart: { type: "donut", height: 250 },
    labels: ["Conectores", "Herramientas", "RAG"],
    title: { text: "Uso de MCPs por tipo" }
  };
}
