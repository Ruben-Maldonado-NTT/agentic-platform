import { AppRoutingModule } from './app-routing.module';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { DesignerComponent } from './pages/designer/designer.component';
import { AgentsCatalogComponent } from './pages/agents-catalog/agents-catalog.component';
import { McpsCatalogComponent } from './pages/mcps-catalog/mcps-catalog.component';
import { McpsManageComponent } from './pages/mcps-manage/mcps-manage.component';
import { LlmsComponent } from './pages/llms/llms.component';
import { TestComponent } from './pages/test/test.component';
import { ReposComponent } from './pages/repos/repos.component';
import { UsersComponent } from './pages/users/users.component';
import { AgentNodeComponent } from './pages/designer/agent-node/agent-node.component';
import { AgencyGroupComponent } from './pages/designer/agency-group/agency-group.component';
import { FilterPipe } from './shared/pipes/filter.pipe';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgDrawFlowComponent, provideNgDrawFlowConfigs } from '@ng-draw-flow/core';


@NgModule({
  declarations: [
    FilterPipe,
    AppComponent,
    DashboardComponent,
    ProjectsComponent,
    AgentsCatalogComponent,
    McpsCatalogComponent,
    McpsManageComponent,
    LlmsComponent,
    TestComponent,
    ReposComponent,
    AgentNodeComponent,
    DesignerComponent,
    AgencyGroupComponent,
    UsersComponent],
  imports: [  AppRoutingModule, 
              BrowserModule, 
              NgApexchartsModule,
              CommonModule,
              HttpClientModule,
              ReactiveFormsModule,
              NgDrawFlowComponent,
            FormsModule],
  providers: [
    provideNgDrawFlowConfigs({
      nodes: {
        agentNode: AgentNodeComponent,
        agencyGroup: AgencyGroupComponent // ← Agregado
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
