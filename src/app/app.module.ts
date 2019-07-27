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
import { StageSelectorComponent } from './component/stage-selector/stage-selector.component';
import { DataSourceComponent } from './component/data-source/data-source.component';
import { UserControlComponent } from './component/user-control/user-control.component';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SelectedService } from './service/selected.service';
import { PenguinService } from './service/penguin.service';
import { GoogleAnalyticsEventsService } from './service/google-analytics-events-service';
import { CookieService } from 'ngx-cookie-service';

import { MatTableModule, MatSortModule, MatCardModule, MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { ReportWarningDialogComponent } from './main/report/dialog.report.component';
import { UserControlDialogComponent } from './component/user-control/dialog.user-control.component';
import { FormsModule } from '@angular/forms';
import { ItemImageComponent } from './component/item-image/item-image.component';
import { MemberCardComponent } from './component/member-card/member-card.component';
import { FooterComponent } from './main/footer/footer.component';
import { HeaderComponent } from './main/header/header.component';
import { MemberComponent } from './main/member/member.component';
import { JoinComponent } from './main/join/join.component';
import { ContactComponent } from './main/contact/contact.component';
import { DonateComponent } from './main/donate/donate.component';
import { LinksComponent } from './main/links/links.component';
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
    declarations: [
        AppComponent,
        ReportComponent,
        ReportWarningDialogComponent,
        StageResultComponent,
        ItemResultComponent,
        IntroComponent,
        LogComponent,
        StageSelectorComponent,
        DataSourceComponent,
        UserControlComponent,
        UserControlDialogComponent,
        ItemImageComponent,
        MemberCardComponent,
        FooterComponent,
        HeaderComponent,
        MemberComponent,
        JoinComponent,
        ContactComponent,
        DonateComponent,
        LinksComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        TooltipModule.forRoot(),
        ButtonsModule.forRoot(),
        CollapseModule.forRoot(),
        AlertModule.forRoot(),
        PopoverModule.forRoot(),
        MatTableModule,
        MatSortModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDialogModule,
        MatIconModule
    ],
    providers: [PenguinService, SelectedService, GoogleAnalyticsEventsService, CookieService],
    bootstrap: [AppComponent],
    entryComponents: [ReportWarningDialogComponent, UserControlDialogComponent]
})
export class AppModule { }
