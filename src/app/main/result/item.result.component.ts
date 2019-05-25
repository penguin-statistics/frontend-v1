import { Component, OnInit, ViewChild } from '@angular/core';
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material';

@Component({
    selector: 'app-result',
    templateUrl: './item.result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ItemResultComponent implements OnInit {

    destroy$: Subject<boolean> = new Subject<boolean>();

    stageList: any = [];
    rows: any;
    chapterList: Chapter[];
    itemList: any = [];
    itemResult: any = null;
    isLoading: boolean = true;
    displayedColumns: string[] = ['code', 'times', 'quantity', 'rate', 'expectation'];
    dataSource: any;
    showTable: boolean = false;

    @ViewChild(MatSort) sort: MatSort;

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
            if (res && (this.penguinService.isTest || res.item.id === this.selectedService.selections.result_by_item.selectedItem.id)) {
                this.itemResult = res;
                this._generateRows();
                this.dataSource = [...this.rows];
                this.dataSource.sort = this.sort;
                this.isLoading = false;
            }
        });
        this.isLoading = true;
        this.showTable = false;
        if (!this.selectedService.selections.result_by_item.selectedItem) {
            this.isLoading = false;
        } else {
            this._refreshItemResult();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    selectItem(item) {
        if (this.selectedService.selections.result_by_item.selectedItem === item) {
            return;
        }
        this.selectedService.selections.result_by_item.selectedItem = item;
        this._refreshItemResult();
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

    private _refreshItemResult() {
        this.isLoading = true;
        this.showTable = true;
        this.rows = new Array();
        this.dataSource = [...this.rows];
        this.itemResult = new Array();
        this.penguinService.getItemResult(this.selectedService.selections.result_by_item.selectedItem.id).subscribe();
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

    private _generateRows() {
        this.rows = new Array();
        this.itemResult.drops.forEach(drop => {
            const rate = drop.quantity / drop.times * 100;
            const expectation = drop.times / drop.quantity * drop.stage.apCost;
            this.rows.push({
                code: drop.stage.code,
                times: drop.times,
                quantity: drop.quantity,
                rate: +rate.toFixed(2),
                expectation: +expectation.toFixed(2),
                stage: drop.stage
            });
        });
    }

    stageComparator = (a: any, b: any) => {
        const t = a.code.localeCompare(b.code);
        if (t !== 0) {
            return t;
        }
        return a.stage.stageType === 'normal' ? -1 : 1;
    };

    sortItemData($event) {
        switch ($event.active) {
            case 'code': {
                this.rows.sort((a, b) => {
                    const parsedA = this.penguinService.parseStageCode(a.code);
                    const parsedB = this.penguinService.parseStageCode(b.code);
                    let result = -1;
                    if (parsedA.isSubStage === parsedB.isSubStage) {
                        result = parsedA.first === parsedB.first ? parsedA.second - parsedB.second : parsedA.first - parsedB.first;
                    } else {
                        if (parsedA.isSubStage) {
                            result = parsedA.first === parsedB.first ? 1 : parsedA.first - parsedB.first;
                        } else {
                            result = parsedA.first === parsedB.first ? -1 : parsedA.first - parsedB.first;
                        }
                    }
                    return $event.direction === 'asc' ? result : -result;
                });
                break;
            }
            default: {
                this.rows.sort((a, b) => {
                    return $event.direction === 'asc' ? a[$event.active] - b[$event.active] : b[$event.active] - a[$event.active];
                });
                break;
            }
        }
        this.dataSource = [...this.rows];
    }

}

interface Chapter {
    name: string;
    stages: any;
}