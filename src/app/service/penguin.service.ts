import { HttpClient } from "@angular/common/http";
import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PenguinService {

    private _api = {
        chapter: "/PenguinStats/api/chapter",
        stage: "/PenguinStats/api/stage",
        item: "/PenguinStats/api/item",
        stageResult: "/PenguinStats/api/result/stage/",
        itemResult: "/PenguinStats/api/result/item/"
    };

    private chapterListDataSource = new BehaviorSubject<any>(null);
    chapterListData = this.chapterListDataSource.asObservable();

    private stageListDataSource = new BehaviorSubject<any>(null);
    stageListData = this.stageListDataSource.asObservable();

    private stageDataSource = new BehaviorSubject<any>(null);
    stageData = this.stageDataSource.asObservable();

    private itemListDataSource = new BehaviorSubject<any>(null);
    itemListData = this.itemListDataSource.asObservable();

    private itemResultDataSource = new BehaviorSubject<any>(null);
    itemResultData = this.itemResultDataSource.asObservable();

    private stageResultDataSource = new BehaviorSubject<any>(null);
    stageResultData = this.stageResultDataSource.asObservable();

    isCollapsed = true;

    isTest = false;

    showStageType = false;

    constructor(private http: HttpClient) {
        this.isTest = isDevMode();
        this.chapterListDataSource.next(null);
        this.stageListDataSource.next(null);
        this.stageDataSource.next(null);
        this.itemListDataSource.next(null);
        this.itemResultDataSource.next(null);
        this.stageResultDataSource.next(null);
    }

    getChapterList(): Observable<any> {
        return this.http.get(this._api.chapter).pipe(map((res) => {
            if (res) {
                this.chapterListDataSource.next(res['chapters']);
            }
            return res['chapters'];
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    alert('未能获取章节列表。\n' + err.message + "\n如果可以的话希望能将以上信息提供给作者，谢谢！");
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        const fakeData = { "chapters": [{ "name": "序章", "stages": [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], "id": 0, "type": "main" }, { "name": "第一章", "stages": [22, 23, 24, 25, 26, 27, 28, 29, 30, 31], "id": 1, "type": "main" }, { "name": "第二章", "stages": [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 74], "id": 2, "type": "main" }, { "name": "第三章", "stages": [53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 0, 10], "id": 3, "type": "main" }, { "name": "第四章", "stages": [1, 2, 3, 4, 5, 6, 7, 8, 9, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73], "id": 4, "type": "main" }, { "name": "限时活动：骑兵与猎人", "closeTime": 1659069016000, "stages": [75], "id": 5, "type": "main", "openTime": 0 }] };
                        this.chapterListDataSource.next(fakeData['chapters']);
                    }, 500);
                    return new Array();
                }
            }
        ));
    }

    getStagesInChapter(id): Observable<any> {
        return this.http.get(this._api.chapter + "/" + id + "/stage").pipe(map((res) => {
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
                    setTimeout(() => {
                        const fakeData = { "stages": [{ "specialDrop": [15], "extraDrop": [12, 13, 14, 16, 17, 18, 26, 33, 34, 35], "code": "4-2", "normalDrop": [14], "id": 1, "category": "main", "apCost": 18 }, { "specialDrop": [19], "extraDrop": [12, 13, 14, 16, 17, 18, 26, 33, 34, 35], "code": "S4-1", "normalDrop": [18], "id": 2, "category": "sub", "apCost": 18 }, { "specialDrop": [25], "extraDrop": [0, 1, 2, 4, 5, 6, 24, 32], "code": "4-4", "normalDrop": [24], "id": 3, "category": "main", "apCost": 18 }, { "specialDrop": [23], "extraDrop": [8, 9, 10, 20, 21, 22, 28, 30], "code": "4-5", "normalDrop": [22], "id": 4, "category": "main", "apCost": 18 }, { "specialDrop": [3], "extraDrop": [0, 1, 2, 4, 5, 6, 24, 32], "code": "4-6", "normalDrop": [2], "id": 5, "category": "main", "apCost": 18 }, { "specialDrop": [27], "extraDrop": [0, 1, 2, 4, 5, 6, 24, 32], "code": "4-7", "normalDrop": [26], "id": 6, "category": "main", "apCost": 18 }, { "specialDrop": [29], "extraDrop": [8, 9, 10, 20, 21, 22, 28, 30], "code": "4-8", "normalDrop": [28], "id": 7, "category": "main", "apCost": 21 }, { "specialDrop": [31], "extraDrop": [8, 9, 10, 20, 21, 22, 28, 30], "code": "4-9", "normalDrop": [30], "id": 8, "category": "main", "apCost": 21 }, { "specialDrop": [7], "extraDrop": [0, 1, 2, 4, 5, 6, 24, 32], "code": "4-10", "normalDrop": [6], "id": 9, "category": "main", "apCost": 21 }, { "specialDrop": [], "extraDrop": [0, 1, 2, 4, 5, 6, 24, 32], "code": "4-1", "normalDrop": [], "id": 64, "category": "main", "apCost": 18 }, { "specialDrop": [], "extraDrop": [0, 1, 2, 4, 5, 6, 24, 32], "code": "4-3", "normalDrop": [35], "id": 65, "category": "main", "apCost": 18 }, { "specialDrop": [], "extraDrop": [8, 9, 10, 20, 21, 22, 28, 30], "code": "S4-2", "normalDrop": [], "id": 66, "category": "sub", "apCost": 18 }, { "specialDrop": [], "extraDrop": [12, 13, 14, 16, 17, 18, 26, 33, 34, 35], "code": "S4-3", "normalDrop": [], "id": 67, "category": "sub", "apCost": 18 }, { "specialDrop": [], "extraDrop": [12, 13, 14, 16, 17, 18, 26, 33, 34, 35], "code": "S4-4", "normalDrop": [], "id": 68, "category": "sub", "apCost": 18 }, { "specialDrop": [], "extraDrop": [8, 9, 10, 20, 21, 22, 28, 30], "code": "S4-5", "normalDrop": [], "id": 69, "category": "sub", "apCost": 18 }, { "specialDrop": [], "extraDrop": [12, 13, 14, 16, 17, 18, 26, 33, 34, 35], "code": "S4-6", "normalDrop": [], "id": 70, "category": "sub", "apCost": 21 }, { "specialDrop": [], "extraDrop": [12, 13, 14, 16, 17, 18, 26, 33, 34, 35], "code": "S4-7", "normalDrop": [], "id": 71, "category": "sub", "apCost": 18 }, { "specialDrop": [], "extraDrop": [8, 9, 10, 20, 21, 22, 28, 30], "code": "S4-8", "normalDrop": [], "id": 72, "category": "sub", "apCost": 18 }, { "specialDrop": [], "extraDrop": [12, 13, 14, 16, 17, 18, 26, 33, 34, 35], "code": "S4-9", "normalDrop": [35], "id": 73, "category": "sub", "apCost": 21 }] };
                        this.stageListDataSource.next(this._sortStageList(fakeData['stages']));
                    }, 500);
                    return new Array();
                }
            }
        ));
    }

    getStage(id): Observable<any> {
        return this.http.get(this._api.stage + "/" + id).pipe(map((res) => {
            if (res) {
                this.stageDataSource.next(res);
            }
            return res;
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    alert('未能获取掉落列表。\n' + err.message + "\n如果可以的话希望能将以上信息提供给作者，谢谢！");
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        const fakeData = { "specialDrop": [{ "img": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_23.png", "itemType": "material", "name": "酮阵列", "timePoint": 0, "id": 23, "materialCategory": "ketone", "rarity": 3 }], "extraDrop": [{ "img": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_8.png", "itemType": "material", "name": "酯原料", "timePoint": 0, "id": 8, "materialCategory": "ester", "rarity": 0 }, { "img": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_9.png", "itemType": "material", "name": "聚酸酯", "timePoint": 0, "id": 9, "materialCategory": "ester", "rarity": 1 }, { "img": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_10.png", "itemType": "material", "name": "聚酸酯组", "timePoint": 0, "id": 10, "materialCategory": "ester", "rarity": 2 }, { "img": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_20.png", "itemType": "material", "name": "双酮", "timePoint": 0, "id": 20, "materialCategory": "ketone", "rarity": 0 }, { "img": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_21.png", "itemType": "material", "name": "酮凝集", "timePoint": 0, "id": 21, "materialCategory": "ketone", "rarity": 1 }, { "img": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_22.png", "itemType": "material", "name": "酮凝集组", "timePoint": 0, "id": 22, "materialCategory": "ketone", "rarity": 2 }, { "img": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_28.png", "itemType": "event", "name": "研磨石", "timePoint": 0, "id": 28, "materialCategory": "grindstone", "rarity": 2 }, { "img": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_30.png", "itemType": "material", "name": "RMA70-12", "timePoint": 0, "id": 30, "materialCategory": "RMA", "rarity": 2 }], "code": "4-5", "normalDrop": [{ "img": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_22.png", "itemType": "material", "name": "酮凝集组", "timePoint": 0, "id": 22, "materialCategory": "ketone", "rarity": 2 }], "id": 4, "category": "main", "apCost": 18 };
                        this.stageDataSource.next(fakeData);
                    }, 500);
                    return new Array();
                }
            }
        ));
    }

    updateItemList(): Observable<any> {
        return this.http.get(this._api.item).pipe(map((res) => {
            if (res) {
                this.itemListDataSource.next(this._sortItemList(res['items']));
            }
            return res['items'];
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    alert('未能获取素材列表。\n' + err.message + "\n如果可以的话希望能将以上信息提供给作者，谢谢！");
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        const fakeData = {"items":[{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_0.png","itemType":"material","name":"源岩","timePoint":0,"id":0,"materialCategory":"rock","rarity":0},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_1.png","itemType":"material","name":"固源岩","timePoint":0,"id":1,"materialCategory":"rock","rarity":1},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_2.png","itemType":"material","name":"固源岩组","timePoint":0,"id":2,"materialCategory":"rock","rarity":2},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_12.png","itemType":"material","name":"代糖","timePoint":0,"id":12,"materialCategory":"sugar","rarity":0},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_13.png","itemType":"material","name":"糖","timePoint":0,"id":13,"materialCategory":"sugar","rarity":1},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_14.png","itemType":"material","name":"糖组","timePoint":0,"id":14,"materialCategory":"sugar","rarity":2},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_15.png","itemType":"material","name":"糖聚块","timePoint":0,"id":15,"materialCategory":"sugar","rarity":3},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_16.png","itemType":"material","name":"异铁碎片","timePoint":0,"id":16,"materialCategory":"iron","rarity":0},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_32.png","itemType":"gold","name":"赤金","timePoint":1,"id":32,"rarity":3},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_33.png","itemType":"exp","name":"基础作战记录","timePoint":1,"id":33,"rarity":1},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_34.png","itemType":"exp","name":"初级作战记录","timePoint":1,"id":34,"rarity":2},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_35.png","itemType":"exp","name":"中级作战记录","timePoint":1,"id":35,"rarity":3},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_36.png","itemType":"exp","name":"高级作战记录","timePoint":1,"id":36,"rarity":4},{"itemType":"furniture","name":"家具","timePoint":0,"id":-1,"rarity":-1},{"img":"https://s3.ap-southeast-1.amazonaws.com/penguin-stats-material-image/material_37.png","itemType":"event","name":"猎人金币","timePoint":0,"id":37,"rarity":4}]};
                        this.itemListDataSource.next(this._sortItemList(fakeData['items']));
                    }, 500);
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
                    }, 500);
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
                    }, 500);
                    return new Array();
                }
            }
        ));
    }

    private _sortStageList(stageList) {
        if (stageList) {
            stageList.sort((a, b) => {
                const parsedA = this.parseStageCode(a.code);
                const parsedB = this.parseStageCode(b.code);
                if (a.category === b.category) {
                    if (isNaN(Number(parsedA.second)) || isNaN(Number(parsedB.second))) {
                        return parsedA.second.localeCompare(parsedB.second);
                    } else {
                        return Number(parsedA.second) - Number(parsedB.second);
                    }
                } else {
                    return a.category === 'sub' ? 1 : -1;
                }
            });
            return stageList;
        }
    }

    private _sortItemList(itemList) {
        if (itemList) {
            itemList.sort((a, b) => {
                return a.name === '家具' ? 1 : b.name === '家具' ? -1 : a.id - b.id;
            });
            return itemList;
        }
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

    public parseStageCode(code: string): any {
        if (!code) {
            return null;
        }
        let splitResult: string[] = code.split('-');
        if (splitResult.length !== 2) {
            return null;
        }
        return {
            first: splitResult[0],
            second: splitResult[1]
        };
    }

};