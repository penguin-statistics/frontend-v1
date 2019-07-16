import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSort, MatSnackBar } from '@angular/material';
import { Stage } from 'src/app/interface/Stage';
import { Chapter } from 'src/app/interface/Chapter';
import { Item } from 'src/app/interface/Item';
import { GoogleAnalyticsEventsService } from 'src/app/service/google-analytics-events-service';

@Component({
    selector: 'app-result',
    templateUrl: './item.result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ItemResultComponent implements OnInit {

    destroy$: Subject<boolean> = new Subject<boolean>();

    stageList: Stage[] = [];
    rows: any;
    chapterList: Chapter[];
    itemList: Item[] = [];
    itemResult: any = null;
    isLoading: boolean = true;
    displayedColumns: string[] = ['code', 'apCost', 'times', 'quantity', 'rate', 'expectation'];
    dataSource: any;
    showTable: boolean = false;
    private _lastSortEvent: any = null;

    @ViewChild(MatSort) sort: MatSort;

    constructor(public penguinService: PenguinService,
        public selectedService: SelectedService,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
        private route: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar,
        private location: Location) { }

    ngOnInit() {
        combineLatest(this.route.paramMap, this.penguinService.itemMapData).pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res && res[0] && res[1]) {
                const paramItemId = res[0].get("itemId");
                if (paramItemId !== null) {
                    const item = res[1][paramItemId];
                    if (item) {
                        this.selectedService.selections.result_by_item.selectedItem = item;
                        this._refreshItemResult();
                    }
                    const url = this.router.createUrlTree(['../'], { relativeTo: this.route }).toString();
                    this.location.go(url);
                }
            }
        });
        this.penguinService.itemListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.itemList = res;
            }
        });
        this.penguinService.chapterListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.chapterList = res;
            }
        });
        this.penguinService.itemResultData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res && (res.item.itemId === this.selectedService.selections.result_by_item.selectedItem.itemId)) {
                this.itemResult = res;
                this._generateRows();
                this.dataSource = [...this.rows];
                this.dataSource.sort = this.sort;
                if (this._lastSortEvent) {
                    this.sortItemData(this._lastSortEvent);
                }
                this.isLoading = false;

                let eventAction = "fetch";
                if (this.penguinService.isPersonal) {
                    eventAction += "_personal";
                } else {
                    eventAction += "_universal";
                }
                this.googleAnalyticsEventsService.emitEvent("result", eventAction, this.selectedService.selections.result_by_item.selectedItem.itemId, 1);
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

    private _refreshItemResult() {
        this.isLoading = true;
        this.showTable = true;
        this.rows = new Array();
        this.dataSource = [...this.rows];
        this.itemResult = new Array();
        this.penguinService.getItemResult(this.selectedService.selections.result_by_item.selectedItem.itemId, this._snackBar).subscribe();
    }

    redirectToStageResult(stage) {
        for (let i = 0; i < this.chapterList.length; i++) {
            if (stage.zoneId === this.chapterList[i].zoneId) {
                this.selectedService.selections.result_by_stage.selectedChapter = this.chapterList[i];
            }
        }
        this.selectedService.selections.result_by_stage.selectedStage = stage;
        this.router.navigateByUrl('/result/stage');
    }

    private _generateRows() {
        this.rows = new Array();
        for (let i = 0; i < this.itemResult.drops.length; i++) {
            let drop = this.itemResult.drops[i];
            if (drop.quantity === 0) {
                continue;
            }
            const rate = drop.quantity / drop.times * 100;
            const expectation = drop.times / drop.quantity * drop.stage.apCost;
            this.rows.push({
                code: drop.stage.code,
                times: drop.times,
                quantity: drop.quantity,
                rate: +rate.toFixed(2),
                expectation: +expectation.toFixed(2),
                stage: drop.stage,
                apCost: drop.stage.apCost
            });
        }
    }

    sortItemData($event) {
        this._lastSortEvent = $event;
        switch ($event.active) {
            case 'code': {
                this.rows.sort((a, b) => {
                    let result = -1;
                    if (a.stage.stageId.startsWith('sub') && b.stage.stageId.startsWith('sub')) {
                        result = a.stage.stageId.localeCompare(b.stage.stageId);
                    } else if (a.stage.stageId.startsWith('sub')) {
                        result = 1;
                    } else if (b.stage.stageId.startsWith('sub')) {
                        result = -1;
                    } else {
                        result = a.stage.stageId.localeCompare(b.stage.stageId);
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
        if (this.selectedService.selections.result_by_item.selectedItem) {
            this._refreshItemResult();
        }
    }

    onLoginSuccess(userID: string) {
        if (this.penguinService.isPersonal) {
            this.onRefreshResult();
        }
    }
}
