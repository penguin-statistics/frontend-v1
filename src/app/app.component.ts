import { Component, ElementRef, Renderer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PenguinService } from './service/penguin.service';
import { Converter } from './util/converter';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    navbar_img: string;

    public constructor(private titleService: Title, public penguinService: PenguinService, private el: ElementRef, private renderer: Renderer, private _snackBar: MatSnackBar) {
        this.titleService.setTitle('Penguin Statistics - 明日方舟素材掉落统计');
        this.penguinService.getAllChapters(this._snackBar).subscribe();
        this.penguinService.getAllStages(this._snackBar).subscribe();
        this.penguinService.getAllItems(this._snackBar).subscribe();
        this.penguinService.isCollapsed = true;
        const r = Math.random();
        if (r < 0.25) {
            this.navbar_img = '../assets/navbar/exia.png';
        } else if (r < 0.5) {
            this.navbar_img = '../assets/navbar/texas.png';
        } else if (r < 0.75) {
            this.navbar_img = '../assets/navbar/sora.png';
        } else {
            this.navbar_img = '../assets/navbar/croissant.png';
        }
        this._convertOldLocalStorage();
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

    private _convertOldLocalStorage() {
        let localStageTimesStr = localStorage.getItem("stageTimes");
        if (localStageTimesStr) {
            let localStageTimes: any = JSON.parse(localStageTimesStr);
            let convertedStageTimes: any = {};
            for (let stageId in localStageTimes) {
                if (Converter.stageIdMap[stageId]) {
                    convertedStageTimes[Converter.stageIdMap[stageId]] = localStageTimes[stageId];
                } else {
                    convertedStageTimes[stageId] = localStageTimes[stageId];
                }
            }
            localStorage.setItem("stageTimes", JSON.stringify(convertedStageTimes));
        }

        let localDropMatrixStr = localStorage.getItem("dropMatrix");
        if (localDropMatrixStr) {
            let localDropMatrix: any = JSON.parse(localDropMatrixStr);
            let convertedDropMatrix: any = {};
            for (let stageId in localDropMatrix) {
                let subMap = localDropMatrix[stageId];
                let convertedSubMap: any = {};
                for (let itemId in subMap) {
                    if (Converter.itemIdMap[itemId]) {
                        convertedSubMap[Converter.itemIdMap[itemId]] = subMap[itemId];
                    } else if (itemId === '-1') {
                        convertedSubMap['furni'] = subMap[itemId];
                    } else {
                        convertedSubMap[itemId] = subMap[itemId];
                    }
                }
                if (Converter.stageIdMap[stageId]) {
                    convertedDropMatrix[Converter.stageIdMap[stageId]] = convertedSubMap;
                } else {
                    convertedDropMatrix[stageId] = convertedSubMap;
                }
            }
            localStorage.setItem("dropMatrix", JSON.stringify(convertedDropMatrix));
        }
    }

}
