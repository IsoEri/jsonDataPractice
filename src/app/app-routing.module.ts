import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';

import { TestPageComponent } from "./test-page/test-page.component";
import { LoginComponent } from "./login/login.component";
import { EvaluationComponent } from "./evaluation/evaluation.component";
import { TopPageComponent } from "./top-page/top-page.component";

// const appRoutes: Routes = environment.routes;
const appRoutes: Routes = [
  { path: 'TestPage', component: TestPageComponent},
  { path: 'Login', component: LoginComponent},
  { path: 'Evaluation', component: EvaluationComponent},
  { path: 'TopPage', component: TopPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
