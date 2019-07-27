import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { PenguinService } from 'src/app/service/penguin.service';
import { GoogleAnalyticsEventsService } from 'src/app/service/google-analytics-events-service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    navbar_img: string;

    constructor(public penguinService: PenguinService,
        private el: ElementRef,
        private renderer: Renderer,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService) { }

    ngOnInit() {
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
    }

    collapseNav() {
        this.renderer.setElementClass(this.el.nativeElement.querySelector('#navbarNavAltMarkup'), 'show', false);
    }

    redirectToPlanner() {
        this.googleAnalyticsEventsService.emitEvent("redirect", "visit", "ArkPlanner", 1);
        window.location.href = "https://planner.penguin-stats.io/";
    }

}
