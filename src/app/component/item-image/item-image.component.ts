import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'item-image',
    templateUrl: './item-image.component.html',
    styleUrls: ['./item-image.component.scss']
})

export class ItemImageComponent implements OnInit {

    @Input() spriteCoord: number[];
    @Input() width: number;
    @Input() height: number;

    constructor() { }

    ngOnInit() {
    }

    getStyle() {
        const x: number = this.height * this.spriteCoord[0];
        const y: number = this.width * this.spriteCoord[1];
        return {
            'background-position': '-' + x + 'px -' + y + 'px',
            'width': this.width + 'px',
            'height': this.height + 'px'
        };
    }

}
