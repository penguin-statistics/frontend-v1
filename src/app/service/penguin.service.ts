import { HttpClient } from "@angular/common/http";
import { StageList } from '../data/stageList';
import { Injectable } from '@angular/core';
import { MaterialList } from '../data/materialList';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PenguinService {

    private stageListDataSource = new BehaviorSubject<any>(null);
    stageListData = this.stageListDataSource.asObservable();

    private itemListDataSource = new BehaviorSubject<any>(null);
    itemListData = this.itemListDataSource.asObservable();

    isCollapsed = true;

    constructor(private http: HttpClient) {
        this.stageListDataSource.next(null);
        this.itemListDataSource.next(null);
    }

    updateStageList(): Observable<any> {
        return this.http.get("/PenguinStats/api/stage").pipe(map((res) => {
            if (res) {
                this.stageListDataSource.next(this._sortStageList(res['stages']));
            }
            return res['stages'];
        })).pipe(catchError(
            (err, caught) => {
                alert('未能获取作战列表。\n' + err.message + "\n将使用实验数据");
                this.stageListDataSource.next(this._sortStageList(StageList));
                return throwError(err);
            }
        ));
    }

    updateItemList() {
        return this.http.get("/PenguinStats/api/item").pipe(map((res) => {
            if (res) {
                this.itemListDataSource.next(this._addFurniture(res['items']));
            }
            return res['items'];
        })).pipe(catchError(
            (err, caught) => {
                alert('未能获取素材列表。\n' + err.message + "\n将使用实验数据");
                this.itemListDataSource.next(this._addFurniture(MaterialList));
                return throwError(err);
            }
        ));
    }

    private _sortStageList(stageList) {
        if (stageList) {
            stageList.sort((a, b) => {
                const parsedA = this.parseStageCode(a.code);
                const parsedB = this.parseStageCode(b.code);
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
            return stageList;
        }
    }

    public parseStageCode(stage: string): any {
        if (!stage) {
            return null;
        }
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

    private _addFurniture(itemList) {
        itemList.push({
            img: null,
            itemType: "furniture",
            name: "家具",
            id: -1,
            rarity: -1
        });
        return itemList;
    }

};