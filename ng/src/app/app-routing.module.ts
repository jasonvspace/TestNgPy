import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectComponent } from './pages/admin/project/project.component';
import { UserComponent } from './pages/admin/user/user.component';
import { TodoComponent } from './pages/admin/todo/todo.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin/projects' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    component: LayoutComponent,
    children: [
      { path: 'projects', component: ProjectComponent },
      { path: 'todos', component: TodoComponent },
      { path: 'users', component: UserComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
