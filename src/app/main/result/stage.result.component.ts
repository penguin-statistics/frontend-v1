import { Component, OnInit, ViewChild } from '@angular/core';
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material';

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
  isLoading: boolean = true;
  displayedColumns: string[] = ['material', 'name', 'times', 'quantity', 'rate', 'expectation'];
  dataSource: any;
  showTable: boolean = false;
  private _lastSortEvent: any = null;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public penguinService: PenguinService, public selectedService: SelectedService, private router: Router) { }

  ngOnInit() {
    this.penguinService.chapterListData.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.chapterList = res.filter(chapter => {
          const timestamp = Number(new Date());
          if (chapter.openTime && chapter.openTime > timestamp) {
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
    this.penguinService.stageResultData.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && (this.penguinService.isTest || this.selectedService.selections.result_by_stage.selectedStage && res.stage.id === this.selectedService.selections.result_by_stage.selectedStage.id && res.stageType === this.selectedService.selections.result_by_stage.stageType)) {
        this.stageResult = res;
        this._generateRows();
        this.dataSource = [...this.rows];
        this.dataSource.sort = this.sort;
        if (this._lastSortEvent) {
          this.sortStageData(this._lastSortEvent);
        }
        this.isLoading = false;
      }
    });
    this.isLoading = true;
    this.showTable = false;
    if (this.selectedService.selections.result_by_stage.selectedChapter != null) {
      this.stageList = null;
      this.penguinService.getStagesInChapter(this.selectedService.selections.result_by_stage.selectedChapter.id).subscribe();
    }
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

  selectChapter(chapter: Chapter) {
    if (this.selectedService.selections.result_by_stage.selectedChapter === chapter) {
      return;
    }
    this.selectedService.selections.result_by_stage.selectedChapter = chapter;
    this.selectedService.selections.result_by_stage.selectedStage = null;
    this.selectedService.selections.result_by_stage.stageType = null;
    this.showTable = false;
    this.stageList = null;
    this.penguinService.getStagesInChapter(chapter.id).subscribe();
  }

  selectStage(stage: any) {
    if (this.selectedService.selections.result_by_stage.selectedStage === stage) {
      return;
    }
    this.selectedService.selections.result_by_stage.selectedStage = stage;
    if (!this.selectedService.selections.result_by_stage.stageType || this.selectedService.selections.result_by_stage.selectedStage.category === 'sub') {
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
      const rate = drop.quantity / drop.times * 100;
      const expectation = drop.times / drop.quantity * this.stageResult.stage.apCost;
      this.rows.push({
        item: drop.item,
        times: drop.times,
        quantity: drop.quantity,
        rate: +rate.toFixed(2),
        expectation: +expectation.toFixed(2)
      });
    });
  }

  sortStageData($event) {
    this._lastSortEvent = $event;
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