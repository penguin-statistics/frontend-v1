import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  stageList: any = [];
  chapterList: Chapter[];

  normalDrops: DropDetail[] = new Array();
  specialDrops: DropDetail[] = new Array();
  extraDrops: DropDetail[] = new Array();
  allDrops: DropDetail[] = new Array();
  isReporting: boolean = false;
  furnitureNum: number = 0;

  constructor(private http: HttpClient, public penguinService: PenguinService, public selectedService: SelectedService) { }

  ngOnInit() {
    this._initSelection();
    this.penguinService.stageListData.subscribe(res => {
      if (res) {
        this.stageList = res;
        this._generateChapterList();
      }
    });
  }

  private _initSelection() {
    this.selectedService.selections.report.selectedChapter = null;
    this.selectedService.selections.report.selectedStage = null;
    this.selectedService.selections.report.isSubStage = null;
    this.selectedService.selections.report.stageType = null;
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

  selectChapter(chapter: Chapter) {
    if (this.selectedService.selections.report.selectedChapter === chapter) {
      return;
    }
    this.selectedService.selections.report.selectedChapter = chapter;
    this.selectedService.selections.report.selectedStage = null;
    this.clearDrops();
  }

  selectStage(stage: any) {
    if (this.selectedService.selections.report.selectedStage === stage) {
      return;
    }
    this.selectedService.selections.report.selectedStage = stage;
    this.selectedService.selections.report.stageType = 'normal';
    this.selectedService.selections.report.isSubStage = this.selectedService.selections.report.selectedStage.code.substring(0, 1) === 'S';
    this.clearDrops();
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
    if (this.selectedService.selections.report.selectedStage) {
      this.selectedService.selections.report.selectedStage.normalDrop.forEach(drop => {
        this.normalDrops.push({
          item: drop,
          quantity: 0
        });
      });
      this.normalDrops.sort((a, b) => a.item.id - b.item.id);
      this.selectedService.selections.report.selectedStage.specialDrop.forEach(drop => {
        this.specialDrops.push({
          item: drop,
          quantity: 0
        });
      });
      this.specialDrops.sort((a, b) => a.item.id - b.item.id);
      this.selectedService.selections.report.selectedStage.extraDrop.forEach(drop => {
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
      stageID: this.selectedService.selections.report.selectedStage.stageID,
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

}

interface DropDetail {
  item: any;
  quantity: number;
};

interface Chapter {
  name: string;
  stages: any;
}