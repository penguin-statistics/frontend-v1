import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReportComponent } from './main/report/report.component';
import { IntroComponent } from './main/intro/intro.component';
import { ItemResultComponent } from './main/result/item.result.component';
import { StageResultComponent } from './main/result/stage.result.component';

@NgModule({
  declarations: [
    AppComponent,
    ReportComponent,
    StageResultComponent,
    ItemResultComponent,
    IntroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
