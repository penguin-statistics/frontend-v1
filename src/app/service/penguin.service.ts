import { HttpClient } from "@angular/common/http";
import { StageList } from '../data/stageList';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PenguinService {

    stageList: any;

    constructor(private http: HttpClient) { }

    _updateStageList() {
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

};