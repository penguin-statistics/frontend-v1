import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';

@Component({
  selector: 'app-result',
  templateUrl: './stage.result.component.html',
  styleUrls: ['./result.component.scss']
})
export class StageResultComponent implements OnInit {

  stageList: any = [];
  chapterList: Chapter[];
  stageResult: any = null;

  constructor(private http: HttpClient, public penguinService: PenguinService, public selectedService: SelectedService) { }

  ngOnInit() {
    this.penguinService.stageListData.subscribe(res => {
      if (res) {
        this.stageList = res;
        this._generateChapterList();
      }
    });
    this._refreshStageResult();
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
    if (this.selectedService.selections.result_by_stage.selectedChapter === chapter) {
      return;
    }
    this.selectedService.selections.result_by_stage.selectedChapter = chapter;
    this.selectedService.selections.result_by_stage.selectedStage = null;
  }

  selectStage(stage: any) {
    if (this.selectedService.selections.result_by_stage.selectedStage === stage) {
      return;
    }
    this.selectedService.selections.result_by_stage.selectedStage = stage;
    this.selectedService.selections.result_by_stage.isSubStage = this.selectedService.selections.result_by_stage.selectedStage.code.substring(0, 1) === 'S';
    if (!this.selectedService.selections.result_by_stage.stageType || this.selectedService.selections.result_by_stage.isSubStage) {
      this.selectedService.selections.result_by_stage.stageType = 'normal';
    }
    this._refreshStageResult();
  }

  selectStageType(stageType: string) {
    if (this.selectedService.selections.result_by_stage.stageType === stageType) {
      return;
    }
    this.selectedService.selections.result_by_stage.stageType = stageType;
    if (this.selectStage) {
      this._refreshStageResult();
    }
  }

  private _refreshStageResult() {
    if (this.selectedService.selections.result_by_stage.selectedStage != null && this.selectedService.selections.result_by_stage.selectedStage.stageID != null && this.selectedService.selections.result_by_stage.stageType != null) {
      this.stageResult = null;
      this.http.get("/PenguinStats/api/result/stage/" + this.selectedService.selections.result_by_stage.selectedStage.stageID + "/" + this.selectedService.selections.result_by_stage.stageType)
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

interface Chapter {
  name: string;
  stages: any;
}