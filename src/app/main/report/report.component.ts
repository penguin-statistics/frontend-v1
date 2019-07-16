import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chapter } from 'src/app/interface/Chapter';
import { Item } from 'src/app/interface/Item';
import { MatSnackBar, MatDialog } from '@angular/material';
import { GoogleAnalyticsEventsService } from 'src/app/service/google-analytics-events-service';
import { Limitation, ItemQuantityBounds, Bounds } from 'src/app/util/limitation';
import { ReportWarningDialogComponent } from './dialog.report.component';
import { ActivatedRoute } from '@angular/router';
import { UserControlComponent } from 'src/app/component/user-control/user-control.component';

interface DropDetail {
    item: Item;
    quantity: number;
};

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

    @ViewChild(UserControlComponent)
    private userControlComponent: UserControlComponent;

    destroy$: Subject<boolean> = new Subject<boolean>();

    itemList: Item[] = [];
    itemMap: any;

    limitationMap: any;

    normalDrops: DropDetail[] = new Array();
    specialDrops: DropDetail[] = new Array();
    extraDrops: DropDetail[] = new Array();
    allDrops: DropDetail[] = new Array();
    isReporting: boolean = false;
    furnitureNum: number = 0;
    checkDrops: boolean = true;

    mode: string = null;

    reportStageFilter: (chapter: Chapter) => boolean = chapter => {
        const timestamp = Number(new Date());
        if (chapter.openTime && chapter.openTime > timestamp) {
            return false;
        }
        if (chapter.closeTime && chapter.closeTime < timestamp) {
            return false;
        }
        return true;
    };

    constructor(private http: HttpClient,
        public penguinService: PenguinService,
        public selectedService: SelectedService,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.penguinService.itemListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.itemList = res;
            }
        });
        this.penguinService.itemMapData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.itemMap = res;
            }
        });
        this.penguinService.limitationMapData.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.limitationMap = res;
            }
        });
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
                this.mode = res.get("mode");
                if (this.mode) {
                    console.log("You have entered " + this.mode + " mode.");
                }
            }
        });
        if (this.selectedService.selections.report.selectedStage && this.selectedService.selections.report.selectedChapter) {
            this.clearDrops();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    onChapterChange($event) {
        this.selectedService.selections.report.selectedChapter = $event;
    }

    onStageChange($event) {
        this.selectedService.selections.report.selectedStage = $event;
        this.clearDrops();
    }

    clearDrops() {
        this.normalDrops = new Array();
        this.specialDrops = new Array();
        this.extraDrops = new Array();
        this.allDrops = new Array();
        this.furnitureNum = 0;
        if (this.itemMap && this.selectedService.selections.report.selectedStage) {
            this.selectedService.selections.report.selectedStage.normalDrop.forEach(itemId => {
                this.normalDrops.push({
                    item: this.itemMap[itemId],
                    quantity: 0
                });
            });
            this.selectedService.selections.report.selectedStage.specialDrop.forEach(itemId => {
                this.specialDrops.push({
                    item: this.itemMap[itemId],
                    quantity: 0
                });
            });
            this.selectedService.selections.report.selectedStage.extraDrop.forEach(itemId => {
                this.extraDrops.push({
                    item: this.itemMap[itemId],
                    quantity: 0
                });
            });
            this.normalDrops.sort((a, b) => a.item.sortId - b.item.sortId);
            this.specialDrops.sort((a, b) => a.item.sortId - b.item.sortId);
            this.extraDrops.sort((a, b) => a.item.sortId - b.item.sortId);
        }
    }

    selectHasFurniture(furnitureNum: number) {
        this.furnitureNum = furnitureNum;
    }

    addQuantity(item: Item, drops: DropDetail[], quantity: number) {
        if (this.isReporting) {
            return false;
        }
        for (let i = 0; i < drops.length; i++) {
            if (drops[i].item === item) {
                drops[i].quantity += quantity;
                if (drops[i].quantity < 0) {
                    drops[i].quantity = 0;
                }
            }
        }
        this._updateAllDrops();
        return false;
    }

    submitDrops() {
        this.isReporting = true;
        let finalResult = {
            stageId: this.selectedService.selections.report.selectedStage.stageId,
            furnitureNum: this.furnitureNum,
            drops: this.allDrops.map(drop => ({
                itemId: drop.item.itemId,
                quantity: drop.quantity
            })),
            source: this.mode !== 'internal' ? "penguin-stats.io" : "penguin-stats.io(internal)",
            version: this.penguinService.version
        };

        if (this.checkDrops && !this._checkDrops(finalResult)) {
            this.googleAnalyticsEventsService.emitEvent("report", "show_warning", this.selectedService.selections.report.selectedStage.stageId, 1);
            this._openDialog();
            this.isReporting = false;
        } else {
            this.http.post(this.penguinService.origin + this.penguinService.api.report, finalResult)
                .subscribe(
                    (val) => {
                        this._snackBar.open("上传成功。", "", { duration: 2000 });
                        this.googleAnalyticsEventsService.emitEvent("report", "submit_single", this.selectedService.selections.report.selectedStage.stageId, 1);
                        this.clearDrops();
                        if (!this.checkDrops) {
                            this.googleAnalyticsEventsService.emitEvent("report", "ignore_warning", this.selectedService.selections.report.selectedStage.stageId, 1);
                        }
                        this.checkDrops = true;
                        this.userControlComponent.refresh();
                    },
                    error => {
                        this._snackBar.open("上传失败。可将以下信息提供给作者以便改进本网站：" + error.message, "x");
                        this.isReporting = false;
                        this.checkDrops = true;
                    },
                    () => {
                        this.isReporting = false;
                        this.checkDrops = true;
                    });
        }
    }

    private _openDialog(): void {
        const dialogRef = this.dialog.open(ReportWarningDialogComponent, {
            width: '500px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.checkDrops = false;
                this.submitDrops();
            }
        });
    }

    private _checkDrops(finalResult: any): boolean {
        try {
            if (this.mode === 'internal') {
                return true;
            }
            if (!this.limitationMap) {
                return true; // check from back-end instead
            }
            const limitation: Limitation = this.limitationMap[finalResult.stageId];
            if (!limitation) {
                return true; // check from back-end instead
            }
            if (limitation.itemTypeBounds) {
                let typeBounds: Bounds = new Bounds(limitation.itemTypeBounds.lower, limitation.itemTypeBounds.upper, limitation.itemTypeBounds.exceptions);
                if (!typeBounds.isValid(finalResult.drops.length)) {
                    return false;
                }
            }
            let dropsMap: any = {};
            finalResult.drops.forEach(drop => {
                dropsMap[drop.itemId] = drop;
            });
            if (finalResult.furnitureNum) {
                dropsMap['furni'] = {
                    itemId: 'furni',
                    quantity: finalResult.furnitureNum
                };
            }
            const itemQuantityBounds: ItemQuantityBounds[] = limitation.itemQuantityBounds;
            if (itemQuantityBounds !== null) {
                for (let i = 0; i < itemQuantityBounds.length; i++) {
                    const oneBounds: ItemQuantityBounds = itemQuantityBounds[i];
                    const drop = dropsMap[oneBounds.itemId];
                    let quantity = !drop ? 0 : drop.quantity;
                    if (oneBounds.bounds) {
                        let bounds: Bounds = new Bounds(oneBounds.bounds.lower, oneBounds.bounds.upper, oneBounds.bounds.exceptions);
                        if (!bounds.isValid(quantity)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        } catch (error) {
            console.log(error);
            return true; // check from back-end instead
        }
    }

    private _updateAllDrops() {
        this.allDrops = new Array();
        let dropDict = {};
        let combinedDrops = this.normalDrops.concat(this.specialDrops).concat(this.extraDrops);
        combinedDrops.forEach(drop => {
            if (drop.quantity !== 0) {
                if (dropDict[drop.item.itemId] === undefined) {
                    this.allDrops.push({
                        item: drop.item,
                        quantity: drop.quantity
                    });
                    dropDict[drop.item.itemId] = this.allDrops.length - 1;
                } else {
                    this.allDrops[dropDict[drop.item.itemId]].quantity += drop.quantity;
                }
            }
        });
    }

    trackByDropItemId(index: number, drop: DropDetail) {
        return drop.item.itemId;
    }

    // changeValue(drop, value) {
    //     drop.quantity = Number(value);
    //     this._updateAllDrops();
    // }

}
