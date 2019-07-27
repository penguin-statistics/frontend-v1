import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-donate',
    templateUrl: './donate.component.html',
    styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

    donateTooltip = "pocky、阿噗噜派也可";

    constructor() { }

    ngOnInit() {
    }

}
