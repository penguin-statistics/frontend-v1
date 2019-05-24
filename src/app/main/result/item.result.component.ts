import { Component, OnInit } from '@angular/core';
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-result',
    templateUrl: './item.result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ItemResultComponent implements OnInit {

    destroy$: Subject<boolean> = new Subject<boolean>();

    stageList: any = [];
    chapterList: Chapter[];
    itemList: any = [];
    itemResult: any = null;
    isLoading: boolean = true;

    constructor(public penguinService: PenguinService, public selectedService: SelectedService, private router: Router) { }

    ngOnInit() {
        this.penguinService.itemListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.itemList = res;
            }
        });
        this.penguinService.stageListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.stageList = res;
                this._generateChapterList();
            }
        });
        this.penguinService.itemResultData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.itemResult = res;
                this.isLoading = false;
            }
        });
        this.isLoading = this.selectedService.selections.result_by_item.selectedItem;
        if (this.selectedService.selections.result_by_item.selectedItem) {
            this.penguinService.getItemResult(this.selectedService.selections.result_by_item.selectedItem.id).subscribe();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    selectItem(item) {
        this.isLoading = true;
        this.selectedService.selections.result_by_item.selectedItem = item;
        this.penguinService.getItemResult(item.id).subscribe();
    }

    private _generateChapterList() {
        this.chapterList = new Array();
        let chapterMap: any = {};
        this.stageList.forEach(stage => {
            const parsedStageCode = this.penguinService.parseStageCode(stage.code);
            if (!chapterMap[parsedStageCode.first]) {
                chapterMap[parsedStageCode.first] = new Array();
            }
            chapterMap[parsedStageCode.first].push(stage);
        });
        for (let key in chapterMap) {
            let chapter: Chapter = {
                name: '第' + key + '章',
                stages: chapterMap[key]
            }
            this.chapterList.push(chapter);
        }
    }

    redirectToStageResult(stage) {
        let parsedStageCode = this.penguinService.parseStageCode(stage.code);
        for (let i = 0; i < this.chapterList.length; i++) {
            const chapter = this.chapterList[i];
            if (chapter.name === '第' + parsedStageCode.first + '章') {
                this.selectedService.selections.result_by_stage.selectedChapter = chapter;
                break;
            }
        }
        this.selectedService.selections.result_by_stage.selectedStage = stage;
        this.selectedService.selections.result_by_stage.isSubStage = parsedStageCode.isSubStage;
        this.selectedService.selections.result_by_stage.stageType = stage.stageType;
        this.router.navigateByUrl('/result/stage');
    }

}

interface Chapter {
    name: string;
    stages: any;
}