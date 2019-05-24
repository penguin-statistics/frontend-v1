import { Component, OnInit } from '@angular/core';
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-result',
  templateUrl: './stage.result.component.html',
  styleUrls: ['./result.component.scss']
})
export class StageResultComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();

  stageList: any = [];
  chapterList: Chapter[];
  stageResult: any = null;
  isLoading: boolean = true;

  constructor(public penguinService: PenguinService, public selectedService: SelectedService, private router: Router) { }

  ngOnInit() {
    this.penguinService.stageListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.stageList = res;
        this._generateChapterList();
      }
    });
    this.penguinService.stageResultData.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.stageResult = res;
        this.isLoading = false;
      }
    });
    this.isLoading = true;
    if (!this.selectedService.selections.result_by_stage.selectedStage || !this.selectedService.selections.result_by_stage.selectedChapter || !this.selectedService.selections.result_by_stage.stageType) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
      this.penguinService.getStageResult(this.selectedService.selections.result_by_stage.selectedStage.id, this.selectedService.selections.result_by_stage.stageType).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
    this.isLoading = true;
    this.penguinService.getStageResult(this.selectedService.selections.result_by_stage.selectedStage.id, this.selectedService.selections.result_by_stage.stageType).subscribe();
  }

  selectStageType(stageType: string) {
    if (this.selectedService.selections.result_by_stage.stageType === stageType) {
      return;
    }
    this.selectedService.selections.result_by_stage.stageType = stageType;
    this.isLoading = true;
    this.penguinService.getStageResult(this.selectedService.selections.result_by_stage.selectedStage.id, this.selectedService.selections.result_by_stage.stageType).subscribe();
  }

  redirectToItemResult(item) {
    this.selectedService.selections.result_by_item.selectedItem = item;
    this.router.navigateByUrl('/result/item');
  }

}

interface Chapter {
  name: string;
  stages: any;
}