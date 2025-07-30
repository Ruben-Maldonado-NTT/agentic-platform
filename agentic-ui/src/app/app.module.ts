import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, ProjectsComponent, DesignerComponent, AgentsCatalogComponent, McpsCatalogComponent, McpsManageComponent, LlmsComponent, TestComponent, ReposComponent, UsersComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MatSidenavModule, MatToolbarModule, MatListModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule, RouterModule.forRoot([{ path: 'dashboard', component: DashboardComponent }, { path: 'projects', component: ProjectsComponent }, { path: 'designer', component: DesignerComponent }, { path: 'agents-catalog', component: AgentsCatalogComponent }, { path: 'mcps-catalog', component: McpsCatalogComponent }, { path: 'mcps-manage', component: McpsManageComponent }, { path: 'llms', component: LlmsComponent }, { path: 'test', component: TestComponent }, { path: 'repos', component: ReposComponent }, { path: 'users', component: UsersComponent }])],
  bootstrap: [AppComponent]
})
export class AppModule {}
