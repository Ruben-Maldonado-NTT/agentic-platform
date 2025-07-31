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
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
{ path: 'dashboard', component: DashboardComponent },
{ path: 'projects', component: ProjectsComponent },
{ path: 'designer', component: DesignerComponent },
{ path: 'agents-catalog', component: AgentsCatalogComponent },
{ path: 'mcps-catalog', component: McpsCatalogComponent },
{ path: 'mcps-manage', component: McpsManageComponent },
{ path: 'llms', component: LlmsComponent },
{ path: 'test', component: TestComponent },
{ path: 'repos', component: ReposComponent },
{ path: 'users', component: UsersComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
