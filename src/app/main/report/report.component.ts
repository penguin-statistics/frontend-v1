import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();

  chapterList: Chapter[];
  stageList: Stage[];
  detailedStage: Stage;
  itemList: any = [];

  normalDrops: DropDetail[] = new Array();
  specialDrops: DropDetail[] = new Array();
  extraDrops: DropDetail[] = new Array();
  allDrops: DropDetail[] = new Array();
  isReporting: boolean = false;
  furnitureNum: number = 0;

  constructor(private http: HttpClient, public penguinService: PenguinService, public selectedService: SelectedService) { }

  ngOnInit() {
    this.penguinService.chapterListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.chapterList = res.filter(chapter => {
          const timestamp = Number(new Date());
          if (chapter.openTime && chapter.openTime > timestamp) {
            return false;
          }
          if (chapter.closeTime && chapter.closeTime < timestamp) {
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
    this.penguinService.stageData.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.detailedStage = res;
        this.clearDrops();
      }
    });
    this.penguinService.itemListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.itemList = res;
      }
    });

    if (this.selectedService.selections.report.selectedChapter != null) {
      this.stageList = null;
      this.penguinService.getStagesInChapter(this.selectedService.selections.report.selectedChapter.id).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  selectChapter(chapter: Chapter) {
    if (this.selectedService.selections.report.selectedChapter === chapter) {
      return;
    }
    this.selectedService.selections.report.selectedChapter = chapter;
    this.selectedService.selections.report.selectedStage = null;
    this.selectedService.selections.report.stageType = null;
    this.stageList = null;
    this.penguinService.getStagesInChapter(chapter.id).subscribe();
  }

  selectStage(stage: any) {
    if (this.selectedService.selections.report.selectedStage === stage) {
      return;
    }
    this.selectedService.selections.report.selectedStage = stage;
    this.selectedService.selections.report.stageType = 'normal';
    this.detailedStage = null;
    this.penguinService.getStage(stage.id).subscribe();
  }

  selectStageType(stageType: string) {
    this.selectedService.selections.report.stageType = stageType;
  }

  selectHasFurniture(furnitureNum: number) {
    this.furnitureNum = furnitureNum;
  }

  addQuantity(item: any, drops: DropDetail[], quantity: number) {
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

  clearDrops() {
    this.normalDrops = new Array();
    this.specialDrops = new Array();
    this.extraDrops = new Array();
    this.allDrops = new Array();
    this.furnitureNum = 0;
    if (this.detailedStage) {
      this.detailedStage.normalDrop.forEach(drop => {
        this.normalDrops.push({
          item: drop,
          quantity: 0
        });
      });
      this.normalDrops.sort((a, b) => a.item.id - b.item.id);
      this.detailedStage.specialDrop.forEach(drop => {
        this.specialDrops.push({
          item: drop,
          quantity: 0
        });
      });
      this.specialDrops.sort((a, b) => a.item.id - b.item.id);
      this.detailedStage.extraDrop.forEach(drop => {
        this.extraDrops.push({
          item: drop,
          quantity: 0
        });
      });
      this.extraDrops.sort((a, b) => a.item.id - b.item.id);
    }
  }

  submitDrops() {
    this.isReporting = true;
    let finalResult = {
      stageID: this.selectedService.selections.report.selectedStage.id,
      stageType: this.selectedService.selections.report.stageType,
      furnitureNum: this.furnitureNum,
      drops: this.allDrops.map(drop => ({
        itemID: drop.item.id,
        quantity: drop.quantity
      }))
    };

    this.http.post("/PenguinStats/api/report", finalResult)
      .subscribe(
        (val) => {
          alert("上传成功，谢谢！");
          this.clearDrops();
        },
        error => {
          alert("上传失败。\n" + error.message + "\n如果可以的话希望能将以上信息提供给作者，谢谢！");
          this.isReporting = false;
        },
        () => {
          this.isReporting = false;
        });

    if (window.localStorage) {
      this._handleLocalStorage(finalResult);
    }
  }

  private _handleLocalStorage(drop) {
    // handle stage times
    let maxTimePoint = 0;
    this.itemList.forEach(item => {
      if (item.timePoint > maxTimePoint) {
        maxTimePoint = item.timePoint;
      }
    });
    maxTimePoint += 1;
    let localStageTimesStr = localStorage.getItem("stageTimes");
    if (!localStageTimesStr) {
      localStageTimesStr = "{}";
    }
    let localStageTimes: any = JSON.parse(localStageTimesStr);
    if (!localStageTimes[drop.stageID]) {
      localStageTimes[drop.stageID] = new Array();
    }
    for (let stageID in localStageTimes) {
      while (localStageTimes[stageID].length < maxTimePoint) {
        localStageTimes[stageID].push(0);
      }
    }
    for (let i = 0; i < localStageTimes[drop.stageID].length; i++) {
      localStageTimes[drop.stageID][i] += 1;
    }

    // handle drop matrix
    let localDropMatrixStr = localStorage.getItem("dropMatrix");
    if (!localDropMatrixStr) {
      localDropMatrixStr = "{}";
    }
    let localDropMatrix: any = JSON.parse(localDropMatrixStr);
    if (!localDropMatrix[drop.stageID]) {
      localDropMatrix[drop.stageID] = {};
    }
    drop.drops.forEach(d => {
      if (!localDropMatrix[drop.stageID][d.itemID]) {
        localDropMatrix[drop.stageID][d.itemID] = 0;
      }
      localDropMatrix[drop.stageID][d.itemID] += d.quantity;
    });
    if (drop.furnitureNum !== 0) {
      if (!localDropMatrix[drop.stageID]['-1']) {
        localDropMatrix[drop.stageID]['-1'] = 0;
      }
      localDropMatrix[drop.stageID]['-1'] += drop.furnitureNum;
    }

    localStorage.setItem("stageTimes", JSON.stringify(localStageTimes));
    localStorage.setItem("dropMatrix", JSON.stringify(localDropMatrix));
  }

  private _updateAllDrops() {
    this.allDrops = new Array();
    let dropDict = {};
    let combinedDrops = this.normalDrops.concat(this.specialDrops).concat(this.extraDrops);
    combinedDrops.forEach(drop => {
      if (drop.quantity !== 0) {
        if (dropDict[drop.item.id] === undefined) {
          this.allDrops.push({
            item: drop.item,
            quantity: drop.quantity
          });
          dropDict[drop.item.id] = this.allDrops.length - 1;
        } else {
          this.allDrops[dropDict[drop.item.id]].quantity += drop.quantity;
        }
      }
    });
  }

  changeValue(drop, value) {
    drop.quantity = Number(value);
    this._updateAllDrops();
  }

}

interface DropDetail {
  item: any;
  quantity: number;
};

interface Chapter {
  name: string;
  stages: any;
  id: number;
  type: string;
}

interface Stage {
  id: number;
  code: string;
  category: string;
  apCost: number;
  normalDrop: any;
  specialDrop: any;
  extraDrop: any;
}