import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReportComponent } from './main/report/report.component';
import { IntroComponent } from './main/intro/intro.component';
import { ItemResultComponent } from './main/result/item.result.component';
import { StageResultComponent } from './main/result/stage.result.component';
import { LogComponent } from './main/log/log.component';
import { StageSelectorComponent } from './main/stage-selector/stage-selector.component';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SelectedService } from './service/selected.service';
import { PenguinService } from './service/penguin.service';

import { MatTableModule, MatSortModule, MatCardModule, MatProgressSpinnerModule, MatSnackBarModule } from '@angular/material';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        ReportComponent,
        StageResultComponent,
        ItemResultComponent,
        IntroComponent,
        LogComponent,
        StageSelectorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TooltipModule.forRoot(),
        ButtonsModule.forRoot(),
        CollapseModule.forRoot(),
        AlertModule.forRoot(),
        MatTableModule,
        MatSortModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [PenguinService, SelectedService],
    bootstrap: [AppComponent]
})
export class AppModule { }
