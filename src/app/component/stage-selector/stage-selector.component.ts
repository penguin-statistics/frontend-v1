import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Chapter } from 'src/app/interface/Chapter';
import { Stage } from 'src/app/interface/Stage';
import { PenguinService } from 'src/app/service/penguin.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';

@Component({
    selector: 'app-stage-selector',
    templateUrl: './stage-selector.component.html',
    styleUrls: ['./stage-selector.component.scss']
})
export class StageSelectorComponent implements OnInit, OnChanges, OnDestroy {

    @Input() chapter: Chapter;
    @Input() stage: Stage;
    @Input() chapterFilter: (chapter: Chapter) => boolean;
    @Output() chapterChange = new EventEmitter<Chapter>();
    @Output() stageChange = new EventEmitter<Stage>();

    destroy$: Subject<boolean> = new Subject<boolean>();

    chapterList: Chapter[];
    stageList: Stage[];
    stageMap: any;

    constructor(public penguinService: PenguinService) { }

    ngOnInit() {
        combineLatest(this.penguinService.chapterListData, this.penguinService.stageMapData).pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res && res[0] && res[1]) {
                this.chapterList = res[0].filter(this.chapterFilter);
                this.stageMap = res[1];
                if (this.chapter) {
                    this._updateStageList(this.chapter);
                }
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.chapter && !changes.chapter.firstChange) {
            this._updateStageList(this.chapter);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    selectChapter(chapter: Chapter) {
        if (chapter !== this.chapter) {
            this.chapterChange.emit(chapter);
            this.stageChange.emit(null);
        }
    }

    selectStage(stage: Stage) {
        if (stage !== this.stage) {
            this.stageChange.emit(stage);
        }
    }

    private _updateStageList(chapter: Chapter) {
        this.stageList = new Array();
        if (chapter && this.stageMap) {
            chapter.stages.forEach(stageId => {
                this.stageList.push(this.stageMap[stageId]);
            });
        }
        this._sortStageList(this.stageList);
    }

    private _sortStageList(stageList) {
        if (stageList) {
            stageList.sort((a, b) => {
                if (a.stageId.startsWith('sub') && b.stageId.startsWith('sub')) {
                    return a.stageId.localeCompare(b.stageId);
                } else if (a.stageId.startsWith('sub')) {
                    return 1;
                } else if (b.stageId.startsWith('sub')) {
                    return -1;
                } else {
                    return a.stageId.localeCompare(b.stageId);
                }
            });
        }
    }

}
