import { Component, OnInit, ViewChild } from '@angular/core';
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';

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
  rows: any;
  isLoading: boolean = true;
  displayedColumns: string[] = ['material', 'name', 'quantity', 'rate', 'expectation'];
  dataSource: any;
  showTable: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public penguinService: PenguinService, public selectedService: SelectedService, private router: Router) { }

  ngOnInit() {
    this.penguinService.stageListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.stageList = res;
        this._generateChapterList();
      }
    });
    this.penguinService.stageResultData.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && (this.penguinService.isTest || this.selectedService.selections.result_by_stage.selectedStage && res.stage.id === this.selectedService.selections.result_by_stage.selectedStage.id && res.stageType === this.selectedService.selections.result_by_stage.stageType)) {
        this.stageResult = res;
        this._generateRows();
        this.dataSource = [...this.rows];
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }
    });
    this.isLoading = true;
    this.showTable = false;
    if (!this.selectedService.selections.result_by_stage.selectedStage || !this.selectedService.selections.result_by_stage.selectedChapter || !this.selectedService.selections.result_by_stage.stageType) {
      this.isLoading = false;
    } else {
      this._refreshStageResult();
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
    this.selectedService.selections.result_by_stage.stageType = null;
    this.selectedService.selections.result_by_stage.isSubStage = null;
    this.showTable = false;
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
    this._refreshStageResult();
  }

  private _refreshStageResult() {
    this.isLoading = true;
    this.showTable = true;
    this.rows = new Array();
    this.dataSource = [...this.rows];
    this.stageResult = new Array();
    this.penguinService.getStageResult(this.selectedService.selections.result_by_stage.selectedStage.id, this.selectedService.selections.result_by_stage.stageType).subscribe();
  }

  redirectToItemResult(item) {
    this.selectedService.selections.result_by_item.selectedItem = item;
    this.router.navigateByUrl('/result/item');
  }

  private _generateRows() {
    this.rows = new Array();
    this.stageResult.drops.forEach(drop => {
      const rate = drop.quantity / this.stageResult.times * 100;
      const expectation = this.stageResult.times / drop.quantity * this.stageResult.stage.apCost;
      this.rows.push({
        item: drop.item,
        quantity: drop.quantity,
        rate: +rate.toFixed(2),
        expectation: +expectation.toFixed(2)
      });
    });
  }

  sortStageData($event) {
    switch ($event.active) {
      case 'material':
      case 'name': {
        this.rows.sort((a, b) => {
          let result = a.item.id === -1 ? 1 : b.item.id === -1 ? -1 : a.item.id - b.item.id;
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

}

interface Chapter {
  name: string;
  stages: any;
}