import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StageList } from '../../data/stageList';
import { Stage } from 'src/app/bean/stage';
import { Item } from 'src/app/bean/item';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  stageList: any;
  selectedStage: any = null;
  stageType: string = null;
  normalDrops: DropDetail[] = new Array();
  specialDrops: DropDetail[] = new Array();
  extraDrops: DropDetail[] = new Array();
  allDrops: DropDetail[] = new Array();
  isReporting: boolean = false;
  furnitureNum: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // 放到app里加载可能更好？
    this.http.get("/PenguinStats/api/stage")
      .subscribe(
        (val) => {
          this.stageList = val['stages'];
          this._sortStageList();
        },
        error => {
          alert('未能获取作战列表。\n' + error.message + "\n将使用hardcoded version");
          this.stageList = StageList;
          this._sortStageList();
        },
        () => {
        });
  }

  private _sortStageList() {
    this.stageList.sort((a, b) => {
      const parsedA = this._parseStageCode(a.code);
      const parsedB = this._parseStageCode(b.code);
      if (parsedA.isSubStage === parsedB.isSubStage) {
        return parsedA.first === parsedB.first ? parsedA.second - parsedB.second : parsedA.first - parsedB.first;
      } else {
        if (parsedA.isSubStage) {
          return parsedA.first === parsedB.first ? 1 : parsedA.first - parsedB.first;
        } else {
          return parsedA.first === parsedB.first ? -1 : parsedA.first - parsedB.first;
        }
      }
    });
  }

  private _parseStageCode(stage: string): any {
    let isSubStage = false;
    if (stage.startsWith('S')) {
      stage = stage.substring(1);
      isSubStage = true;
    }
    let splitResult = stage.split('-');
    if (splitResult.length !== 2) {
      return null;
    }
    return {
      isSubStage: isSubStage,
      first: new Number(splitResult[0]).valueOf(),
      second: new Number(splitResult[1]).valueOf()
    };
  }

  selectStage(stage: any) {
    if (this.selectedStage === stage) {
      return;
    }
    this.selectedStage = stage;
    this.stageType = 'normal';
    this.clearDrops();
  }

  selectStageType(stageType: string) {
    this.stageType = stageType;
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
    this.selectedStage.normalDrop.forEach(drop => {
      this.normalDrops.push({
        item: drop,
        quantity: 0
      });
    });
    this.normalDrops.sort((a, b) => a.item.id - b.item.id);
    this.selectedStage.specialDrop.forEach(drop => {
      this.specialDrops.push({
        item: drop,
        quantity: 0
      });
    });
    this.specialDrops.sort((a, b) => a.item.id - b.item.id);
    this.selectedStage.extraDrop.forEach(drop => {
      this.extraDrops.push({
        item: drop,
        quantity: 0
      });
    });
    this.extraDrops.sort((a, b) => a.item.id - b.item.id);
  }

  submitDrops() {
    this.isReporting = true;
    let finalResult = {
      stageID: this.selectedStage.stageID,
      stageType: this.stageType,
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