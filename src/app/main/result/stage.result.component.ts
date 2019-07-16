import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSort, MatSnackBar } from '@angular/material';
import { Chapter } from 'src/app/interface/Chapter';
import { Stage } from 'src/app/interface/Stage';
import { GoogleAnalyticsEventsService } from 'src/app/service/google-analytics-events-service';

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
    displayedColumns: string[] = ['material', 'name', 'times', 'quantity', 'rate', 'expectation'];
    dataSource: any;

    isLoading: boolean = true;
    showTable: boolean = false;

    private _lastSortEvent: any = null;

    resultStageFilter: (chapter: Chapter) => boolean = chapter => {
        const timestamp = Number(new Date());
        if (chapter.openTime && chapter.openTime > timestamp) {
            return false;
        }
        return true;
    };

    @ViewChild(MatSort) sort: MatSort;

    constructor(public penguinService: PenguinService,
        public selectedService: SelectedService,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
        private route: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar,
        private location: Location) {
    }

    ngOnInit() {
        combineLatest(this.route.paramMap, this.penguinService.stageMapData, this.penguinService.chapterListData).pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res && res[0] && res[1] && res[2]) {
                const paramStageId = res[0].get("stageId");
                if (paramStageId !== null) {
                    const stage = res[1][paramStageId];
                    if (stage) {
                        for (let i = 0; i < res[2].length; i++) {
                            if (res[2][i].zoneId === stage.zoneId) {
                                this.selectedService.selections.result_by_stage.selectedChapter = res[2][i];
                                this.selectedService.selections.result_by_stage.selectedStage = stage;
                                this._refreshStageResult();
                                break;
                            }
                        }
                    }
                    const url = this.router.createUrlTree(['../'], { relativeTo: this.route }).toString();
                    this.location.go(url);
                }
            }
        });
        this.penguinService.stageResultData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res && (this.selectedService.selections.result_by_stage.selectedStage && res.stage.stageId === this.selectedService.selections.result_by_stage.selectedStage.stageId)) {
                this.stageResult = res;
                this._generateRows();
                this.dataSource = [...this.rows];
                this.dataSource.sort = this.sort;
                if (this._lastSortEvent) {
                    this.sortStageData(this._lastSortEvent);
                }
                this.isLoading = false;
                this.showTable = true;

                let eventAction = "fetch";
                if (this.penguinService.isPersonal) {
                    eventAction += "_personal";
                } else {
                    eventAction += "_universal";
                }
                this.googleAnalyticsEventsService.emitEvent("result", eventAction, this.selectedService.selections.result_by_stage.selectedStage.stageId, 1);
            }
        });
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

    onChapterChange($event) {
        this.selectedService.selections.result_by_stage.selectedChapter = $event;
        this.showTable = false;
        this.isLoading = false;
    }

    onStageChange($event) {
        this.selectedService.selections.result_by_stage.selectedStage = $event;
        this._refreshStageResult();
    }

    private _refreshStageResult() {
        this.rows = new Array();
        this.dataSource = [...this.rows];
        this.stageResult = new Array();
        if (this.selectedService.selections.result_by_stage.selectedStage) {
            this.isLoading = true;
            this.showTable = false;
            this.penguinService.getStageResult(this.selectedService.selections.result_by_stage.selectedStage.stageId, this._snackBar).subscribe();
        }
    }

    redirectToItemResult(item) {
        this.selectedService.selections.result_by_item.selectedItem = item;
        this.router.navigateByUrl('/result/item');
    }

    private _generateRows() {
        this.rows = new Array();
        for (let i = 0; i < this.stageResult.drops.length; i++) {
            let drop = this.stageResult.drops[i];
            if (drop.quantity === 0) {
                continue;
            }
            const rate = drop.quantity / drop.times * 100;
            const expectation = drop.times / drop.quantity * this.stageResult.stage.apCost;
            this.rows.push({
                item: drop.item,
                times: drop.times,
                quantity: drop.quantity,
                rate: +rate.toFixed(2),
                expectation: +expectation.toFixed(2)
            });
        }
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

    onRefreshResult() {
        if (this.selectedService.selections.result_by_stage.selectedStage
            && this.selectedService.selections.result_by_stage.selectedChapter) {
            this._refreshStageResult();
        }
    }

    onLoginSuccess(userID: string) {
        if (this.penguinService.isPersonal) {
            this.onRefreshResult();
        }
    }
}
