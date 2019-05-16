import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportComponent } from './main/report/report.component';
import { ResultComponent } from './main/result/result.component';
import { IntroComponent } from './main/intro/intro.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'intro', pathMatch: 'full'
  },
  {
    path: 'intro', component: IntroComponent
  },
  {
    path: 'report', component: ReportComponent
  },
  {
    path: 'result', component: ResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
