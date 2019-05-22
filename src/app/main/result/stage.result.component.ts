import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PenguinService } from 'src/app/service/penguin.service';

@Component({
  selector: 'app-result',
  templateUrl: './stage.result.component.html',
  styleUrls: ['./result.component.scss']
})
export class StageResultComponent implements OnInit {

  selectedStage: any = null;
  stageType: string = null;
  stageResult: any = null;

  constructor(private http: HttpClient, public penguinService: PenguinService) { }

  ngOnInit() {
  }

  selectStage(stage: any) {
    if (this.selectedStage === stage) {
      return;
    }
    this.selectedStage = stage;
    if (!this.stageType) {
      this.stageType = 'normal';
    }
    this._refreshStageResult();
  }

  selectStageType(stageType: string) {
    if (this.stageType === stageType) {
      return;
    }
    this.stageType = stageType;
    if (this.selectStage) {
      this._refreshStageResult();
    }
  }

  private _refreshStageResult() {
    this.stageResult = null;
    this.http.get("/PenguinStats/api/result/stage/" + this.selectedStage.stageID + "/" + this.stageType)
      .subscribe(
        (val) => {
          this.stageResult = val;
          this._sortStageResult();
        },
        error => {
          alert('获取结果失败。\n' + error.message + "\n如果可以的话希望能将以上信息提供给作者，谢谢！");
          // this.stageResult = { "times": 57, "drops": [{ "item": { "img": "http://p0.qhimg.com/dr/100__/t01ad2e7fb00256fd86.png", "itemType": "material", "name": "源岩", "id": 0, "materialCategory": "rock", "rarity": 0 }, "quantity": 18 }, { "item": { "itemType": "furniture", "name": "家具", "id": -1, "rarity": -1 }, "quantity": 1 }, { "item": { "img": "http://p7.qhimg.com/dr/100__/t0199099c5b08a71a7c.png", "itemType": "material", "name": "固源岩", "id": 1, "materialCategory": "rock", "rarity": 1 }, "quantity": 15 }, { "item": { "img": "http://p0.qhimg.com/dr/100__/t01e388e4bd786583cc.png", "itemType": "material", "name": "固源岩组", "id": 2, "materialCategory": "rock", "rarity": 2 }, "quantity": 24 }, { "item": { "img": "http://p1.qhimg.com/dr/100__/t0155cbcc61b719b8f0.png", "itemType": "material", "name": "提纯源岩", "id": 3, "materialCategory": "rock", "rarity": 3 }, "quantity": 3 }, { "item": { "img": "http://p0.qhimg.com/dr/100__/t01d215deb8b5d92450.png", "itemType": "material", "name": "破损装置", "id": 4, "materialCategory": "device", "rarity": 0 }, "quantity": 6 }, { "item": { "img": "http://p7.qhimg.com/dr/100__/t0168ce9414da96fd12.png", "itemType": "material", "name": "装置", "id": 5, "materialCategory": "device", "rarity": 1 }, "quantity": 9 }, { "item": { "img": "http://p5.qhimg.com/dr/100__/t011e4890ca178623a8.png", "itemType": "material", "name": "全新装置", "id": 6, "materialCategory": "device", "rarity": 2 }, "quantity": 2 }, { "item": { "img": "http://p5.qhimg.com/dr/100__/t012969254d8c583793.png", "itemType": "material", "name": "扭转醇", "id": 24, "materialCategory": "alcohol", "rarity": 2 }, "quantity": 1 }], "stage": { "specialDrop": [3], "extraDrop": [0, 1, 2, 4, 5, 6, 24], "code": "4-6", "normalDrop": [2], "id": 5, "apCost": 18 } };
          // this._sortStageResult();
        },
        () => {
        });
  }

  private _sortStageResult() {
    if (!this.stageResult) {
      return;
    }
    this.stageResult.drops.sort((a, b) => {
      if (a.item.id === -1) {
        return 1;
      }
      if (b.item.id === -1) {
        return -1;
      }
      return b.quantity - a.quantity;
    });
  }

}
