import { Component, ElementRef, Renderer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PenguinService } from './service/penguin.service';
import { MatSnackBar } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GoogleAnalyticsEventsService } from './service/google-analytics-events-service';


declare let ga: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    navbar_img: string;

    public constructor(private titleService: Title,
        public penguinService: PenguinService,
        private el: ElementRef,
        private renderer: Renderer,
        private _snackBar: MatSnackBar,
        public router: Router,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService, ) {


        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                ga('set', 'page', event.urlAfterRedirects);
                ga('send', 'pageview');
            }
        });

        this.titleService.setTitle('Penguin Statistics - 明日方舟素材掉落统计');
        this.penguinService.getAllChapters(this._snackBar).subscribe();
        this.penguinService.getAllStages(this._snackBar).subscribe();
        this.penguinService.getAllItems(this._snackBar).subscribe();
        this.penguinService.getLimitations(this._snackBar).subscribe();
        this.penguinService.isCollapsed = true;

        const r = Math.random();
        if (r < 0.25) {
            this.navbar_img = 'https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_exia.png';
        } else if (r < 0.5) {
            this.navbar_img = 'https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_texas.png';
        } else if (r < 0.75) {
            this.navbar_img = 'https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_sora.png';
        } else {
            this.navbar_img = 'https://penguin-stats.s3-ap-southeast-1.amazonaws.com/penguin_stats_logo_croissant.png';
        }

        this._checkLocalStorage();
    }

    ngOnInit() {
        if (!this.penguinService.isTest) {
            if (location.protocol === 'http:' && location.hostname != 'localhost') {
                window.location.href = location.href.replace('http', 'https');
            }
        }
    }

    collapseNav() {
        this.renderer.setElementClass(this.el.nativeElement.querySelector('#navbarNavAltMarkup'), 'show', false);
    }

    redirectToPlanner() {
        this.googleAnalyticsEventsService.emitEvent("redirect", "visit", "ArkPlanner", 1);
        window.location.href = "https://planner.penguin-stats.io/";
    }

    private _checkLocalStorage() {
        try {
            let localStageTimesStr = localStorage.getItem("stageTimes");
            if (localStageTimesStr) {
                JSON.parse(localStageTimesStr);
            } else {
                localStorage.setItem("stageTimes", "{}");
            }
            let localDropMatrixStr = localStorage.getItem("dropMatrix");
            if (localDropMatrixStr) {
                JSON.parse(localDropMatrixStr);
            } else {
                localStorage.setItem("dropMatrix", "{}");
            }
        } catch (error) {
            localStorage.setItem("stageTimes", "{}");
            localStorage.setItem("dropMatrix", "{}");
            this._snackBar.open("您的本地数据出现异常，已清空。", "x", { duration: 2000 });
        }
    }

}
