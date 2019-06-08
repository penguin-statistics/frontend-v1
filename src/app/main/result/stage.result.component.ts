import { Component, OnInit, ViewChild } from '@angular/core';
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSort, MatSnackBar } from '@angular/material';
import { Chapter } from 'src/app/interface/Chapter';
import { Stage } from 'src/app/interface/Stage';

@Component({
    selector: 'app-result',
    templateUrl: './stage.result.component.html',
    styleUrls: ['./result.component.scss']
})
export class StageResultComponent implements OnInit {

    destroy$: Subject<boolean> = new Subject<boolean>();

    chapterList: Chapter[];
    stageList: Stage[];
    stageResult: any = null;
    rows: any;
    isLoading: boolean = true;
    displayedColumns: string[] = ['material', 'name', 'times', 'quantity', 'rate', 'expectation'];
    dataSource: any;
    showTable: boolean = false;
    private _lastSortEvent: any = null;

    @ViewChild(MatSort) sort: MatSort;

    constructor(public penguinService: PenguinService, public selectedService: SelectedService, private router: Router, private _snackBar: MatSnackBar) { }

    ngOnInit() {
        this.penguinService.chapterListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.chapterList = res.filter(chapter => {
                    const timestamp = Number(new Date());
                    if (chapter.openTime && chapter.openTime > timestamp) {
                        return false;
                    }
                    return true;
                });
            }
        });
        this.penguinService.stageListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.stageList = res;
            }
        });
        this.penguinService.stageResultData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res && (this.penguinService.isTest || this.selectedService.selections.result_by_stage.selectedStage && res.stage.stageId === this.selectedService.selections.result_by_stage.selectedStage.stageId)) {
                this.stageResult = res;
                this._generateRows();
                this.dataSource = [...this.rows];
                this.dataSource.sort = this.sort;
                if (this._lastSortEvent) {
                    this.sortStageData(this._lastSortEvent);
                }
                this.isLoading = false;
            }
        });

        this.isLoading = true;
        this.showTable = false;
        if (this.selectedService.selections.result_by_stage.selectedChapter != null) {
            this.stageList = null;
            this.penguinService.getStagesInChapter(this.selectedService.selections.result_by_stage.selectedChapter.zoneId, this._snackBar).subscribe();
        }
        if (!this.selectedService.selections.result_by_stage.selectedStage || !this.selectedService.selections.result_by_stage.selectedChapter) {
            this.isLoading = false;
        } else {
            this._refreshStageResult();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    selectChapter(chapter: Chapter) {
        if (this.selectedService.selections.result_by_stage.selectedChapter === chapter) {
            return;
        }
        this.selectedService.selections.result_by_stage.selectedChapter = chapter;
        this.selectedService.selections.result_by_stage.selectedStage = null;
        this.showTable = false;
        this.stageList = null;
        this.penguinService.getStagesInChapter(chapter.zoneId, this._snackBar).subscribe();
    }

    selectStage(stage: any) {
        if (this.selectedService.selections.result_by_stage.selectedStage === stage) {
            return;
        }
        this.selectedService.selections.result_by_stage.selectedStage = stage;
        this._refreshStageResult();
    }

    private _refreshStageResult() {
        this.isLoading = true;
        this.showTable = true;
        this.rows = new Array();
        this.dataSource = [...this.rows];
        this.stageResult = new Array();
        this.penguinService.getStageResult(this.selectedService.selections.result_by_stage.selectedStage.stageId, this._snackBar).subscribe();
    }

    redirectToItemResult(item) {
        this.selectedService.selections.result_by_item.selectedItem = item;
        this.router.navigateByUrl('/result/item');
    }

    private _generateRows() {
        this.rows = new Array();
        this.stageResult.drops.forEach(drop => {
            const rate = drop.quantity / drop.times * 100;
            const expectation = drop.times / drop.quantity * this.stageResult.stage.apCost;
            this.rows.push({
                item: drop.item,
                times: drop.times,
                quantity: drop.quantity,
                rate: +rate.toFixed(2),
                expectation: +expectation.toFixed(2)
            });
        });
    }

    sortStageData($event) {
        this._lastSortEvent = $event;
        switch ($event.active) {
            case 'material':
            case 'name': {
                this.rows.sort((a, b) => {
                    let result = 1;
                    if (a.item.name === '家具') {
                        result = 1;
                    } else if (b.item.name === '家具') {
                        result = -1;
                    } else if (a.item.name === '赤金') {
                        result = 1;
                    } else if (b.item.name === '赤金') {
                        result = -1;
                    } else {
                        result = a.item.sortId - b.item.sortId;
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

    selectDataSource(isPersonal: boolean) {
        if (this.penguinService.isPersonal === isPersonal) {
            return;
        }
        if (!window.localStorage) {
            alert("您的浏览器暂不支持本地数据，请升级或者换浏览器再试。");
            return;
        }
        let localStageTimesStr = localStorage.getItem("stageTimes");
        let localDropMatrixStr = localStorage.getItem("dropMatrix");
        if (isPersonal && (!localStageTimesStr || !localDropMatrixStr)) {
            alert("您当前还未上传过掉落数据。");
            return;
        }
        this.penguinService.isPersonal = isPersonal;
        if (this.selectedService.selections.result_by_stage.selectedStage && this.selectedService.selections.result_by_stage.selectedChapter) {
            this._refreshStageResult();
        }
    }

}
