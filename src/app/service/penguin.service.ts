import { HttpClient } from "@angular/common/http";
import { StageList } from '../data/stageList';
import { Injectable, isDevMode } from '@angular/core';
import { MaterialList } from '../data/materialList';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PenguinService {

    private _api = {
        stageList: "/PenguinStats/api/stage",
        itemList: "/PenguinStats/api/item",
        stageResult: "/PenguinStats/api/result/stage/",
        itemResult: "/PenguinStats/api/result/item/"
    };

    private stageListDataSource = new BehaviorSubject<any>(null);
    stageListData = this.stageListDataSource.asObservable();

    private itemListDataSource = new BehaviorSubject<any>(null);
    itemListData = this.itemListDataSource.asObservable();

    private itemResultDataSource = new BehaviorSubject<any>(null);
    itemResultData = this.itemResultDataSource.asObservable();

    private stageResultDataSource = new BehaviorSubject<any>(null);
    stageResultData = this.stageResultDataSource.asObservable();

    isCollapsed = true;

    isTest = false;

    constructor(private http: HttpClient) {
        this.isTest = isDevMode();
        this.stageListDataSource.next(null);
        this.itemListDataSource.next(null);
        this.itemResultDataSource.next(null);
        this.stageResultDataSource.next(null);
    }

    updateStageList(): Observable<any> {
        return this.http.get(this._api.stageList).pipe(map((res) => {
            if (res) {
                this.stageListDataSource.next(this._sortStageList(res['stages']));
            }
            return res['stages'];
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    alert('未能获取作战列表。\n' + err.message + "\n如果可以的话希望能将以上信息提供给作者，谢谢！");
                    return throwError(err);
                } else {
                    this.stageListDataSource.next(this._sortStageList(StageList));
                    return new Array();
                }
            }
        ));
    }

    updateItemList(): Observable<any> {
        return this.http.get(this._api.itemList).pipe(map((res) => {
            if (res) {
                this.itemListDataSource.next(this._addFurniture(res['items']));
            }
            return res['items'];
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    alert('未能获取素材列表。\n' + err.message + "\n如果可以的话希望能将以上信息提供给作者，谢谢！");
                    return throwError(err);
                } else {
                    this.itemListDataSource.next(this._addFurniture(MaterialList));
                    return new Array();
                }
            }
        ));
    }

    getItemResult(id): Observable<any> {
        return this.http.get(this._api.itemResult + id).pipe(map((res) => {
            if (res) {
                res = this._sortItemResult(res);
                this.itemResultDataSource.next(res);
            }
            return res;
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    alert('获取结果失败。\n' + err.message + "\n如果可以的话希望能将以上信息提供给作者，谢谢！");
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        let fakeItemResult = { "item": { "img": "http://p3.qhimg.com/dr/100__/t018a302bcf4e1fb3c1.png", "itemType": "material", "name": "聚酸酯组", "id": 10, "materialCategory": "ester", "rarity": 2 }, "drops": [{ "times": 46, "quantity": 1, "stage": { "specialDrop": [23], "extraDrop": [8, 9, 10, 20, 21, 22, 28, 30], "code": "4-5", "stageType": "assault", "normalDrop": [22], "id": 4, "apCost": 18 } }, { "times": 48, "quantity": 1, "stage": { "specialDrop": [31], "extraDrop": [8, 9, 10, 20, 21, 22, 28, 30], "code": "4-9", "stageType": "normal", "normalDrop": [30], "id": 8, "apCost": 21 } }, { "times": 5, "quantity": 1, "stage": { "specialDrop": [11], "extraDrop": [8, 9, 10, 20, 21, 22, 28, 30], "code": "3-8", "stageType": "normal", "normalDrop": [10], "id": 0, "apCost": 18 } }] }
                        fakeItemResult = this._sortItemResult(fakeItemResult);
                        this.itemResultDataSource.next(fakeItemResult);
                    }, 1000);
                    return new Array();
                }
            }
        ));
    }

    getStageResult(id, type): Observable<any> {
        return this.http.get(this._api.stageResult + id + "/" + type).pipe(map((res) => {
            if (res) {
                res = this._sortStageResult(res);
                this.stageResultDataSource.next(res);
            }
            return res;
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    alert('获取结果失败。\n' + err.message + "\n如果可以的话希望能将以上信息提供给作者，谢谢！");
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        let fakeStageResult = { "drops": [{ "item": { "img": "assets/material_img/material_0.png", "itemType": "material", "name": "源岩", "id": 0, "materialCategory": "rock", "rarity": 0 }, "quantity": 158, "times": 501 }, { "item": { "itemType": "furniture", "name": "家具", "id": -1, "rarity": -1 }, "quantity": 16, "times": 501 }, { "item": { "img": "assets/material_img/material_1.png", "itemType": "material", "name": "固源岩", "id": 1, "materialCategory": "rock", "rarity": 1 }, "quantity": 157, "times": 123 }, { "item": { "img": "assets/material_img/material_2.png", "itemType": "material", "name": "固源岩组", "id": 2, "materialCategory": "rock", "rarity": 2 }, "quantity": 215, "times": 123 }, { "item": { "img": "assets/material_img/material_3.png", "itemType": "material", "name": "提纯源岩", "id": 3, "materialCategory": "rock", "rarity": 3 }, "quantity": 24, "times": 501 }, { "item": { "img": "assets/material_img/material_4.png", "itemType": "material", "name": "破损装置", "id": 4, "materialCategory": "device", "rarity": 0 }, "quantity": 45, "times": 501 }, { "item": { "img": "assets/material_img/material_5.png", "itemType": "material", "name": "装置", "id": 5, "materialCategory": "device", "rarity": 1 }, "quantity": 62, "times": 501 }, { "item": { "img": "assets/material_img/material_6.png", "itemType": "material", "name": "全新装置", "id": 6, "materialCategory": "device", "rarity": 2 }, "quantity": 9, "times": 123 }, { "item": { "img": "assets/material_img/material_24.png", "itemType": "material", "name": "扭转醇", "id": 24, "materialCategory": "alcohol", "rarity": 2 }, "quantity": 13, "times": 583 }], "stage": { "specialDrop": [3], "extraDrop": [0, 1, 2, 4, 5, 6, 24], "code": "4-6", "normalDrop": [2], "id": 5, "apCost": 18 }, "stageType": "normal" };
                        fakeStageResult = this._sortStageResult(fakeStageResult);
                        this.stageResultDataSource.next(fakeStageResult);
                    }, 1000);
                    return new Array();
                }
            }
        ));
    }

    private _sortItemResult(result) {
        if (!result) {
            return;
        }
        result.drops.sort((a, b) => {
            return b.quantity / b.times - a.quantity / a.times;
        });
        return result;
    }

    private _sortStageResult(result) {
        if (!result) {
            return;
        }
        result.drops.sort((a, b) => {
            if (a.item.id === -1) {
                return 1;
            }
            if (b.item.id === -1) {
                return -1;
            }
            return b.quantity - a.quantity;
        });
        return result;
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