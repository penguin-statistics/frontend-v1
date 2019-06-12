import { HttpClient } from "@angular/common/http";
import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class PenguinService {

    public origin: string;

    public api: any = {
        chapter: "/PenguinStats/api/zone",
        stage: "/PenguinStats/api/stage",
        item: "/PenguinStats/api/item",
        stageResult: "/PenguinStats/api/result/stage/",
        itemResult: "/PenguinStats/api/result/item/",
        report: "/PenguinStats/api/report"
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

    isPersonal = false;

    constructor(private http: HttpClient) {
        this.isTest = isDevMode();
        this.chapterListDataSource.next(null);
        this.stageListDataSource.next(null);
        this.stageDataSource.next(null);
        this.itemListDataSource.next(null);
        this.itemResultDataSource.next(null);
        this.stageResultDataSource.next(null);
        if (location.hostname === 'localhost') {
            this.origin = location.origin.replace(location.port, '8080');
        } else {
            this.origin = location.origin;
        }
    }

    getChapterList(snackBar: MatSnackBar = null): Observable<any> {
        return this.http.get(this.origin + this.api.chapter).pipe(map((res) => {
            if (res) {
                this.chapterListDataSource.next(res['zones']);
            }
            return res['zones'];
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    if (!snackBar) {
                        alert('未能获取章节列表。可将以下信息提供给作者以便改进本网站：' + err.message);
                    } else {
                        snackBar.open("未能获取章节列表。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                    }
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        const fakeData = { "zones": [{ "zoneIndex": 0, "stages": ["main_00-01", "main_00-02", "main_00-03", "main_00-04", "main_00-05", "main_00-06", "main_00-07", "main_00-08", "main_00-09", "main_00-10", "main_00-11"], "zoneId": "main_0", "zoneName": "序章", "type": "MAINLINE" }, { "zoneIndex": 1, "stages": ["main_01-01", "main_01-02", "main_01-03", "main_01-04", "main_01-05", "main_01-06", "main_01-07", "main_01-08", "main_01-09", "main_01-10", "main_01-11", "main_01-12"], "zoneId": "main_1", "zoneName": "第一章", "type": "MAINLINE" }, { "zoneIndex": 2, "stages": ["main_02-01", "main_02-02", "main_02-03", "main_02-04", "main_02-05", "main_02-06", "main_02-07", "main_02-08", "main_02-09", "main_02-10", "sub_02-01", "sub_02-02", "sub_02-03", "sub_02-04", "sub_02-05", "sub_02-06", "sub_02-07", "sub_02-08", "sub_02-09", "sub_02-10", "sub_02-11", "sub_02-12"], "zoneId": "main_2", "zoneName": "第二章", "type": "MAINLINE" }, { "zoneIndex": 3, "stages": ["main_03-01", "main_03-02", "main_03-03", "main_03-04", "main_03-05", "main_03-06", "main_03-07", "main_03-08", "sub_03-1-1", "sub_03-1-2", "sub_03-2-1", "sub_03-2-2", "sub_03-2-3"], "zoneId": "main_3", "zoneName": "第三章", "type": "MAINLINE" }, { "zoneIndex": 4, "stages": ["main_04-01", "main_04-02", "main_04-03", "main_04-04", "main_04-05", "main_04-06", "main_04-07", "main_04-08", "main_04-08", "main_04-09", "main_04-10", "sub_04-1-1", "sub_04-1-2", "sub_04-1-3", "sub_04-2-1", "sub_04-2-2", "sub_04-2-3", "sub_04-3-1", "sub_04-3-2", "sub_04-3-3"], "zoneId": "main_4", "zoneName": "第四章", "type": "MAINLINE" }, { "zoneIndex": 0, "closeTime": 1560369599000, "stages": ["a001_01", "a001_02", "a001_03", "a001_04", "a001_05", "a001_06"], "zoneId": "A001_zone1", "zoneName": "限时活动：骑兵与猎人", "type": "ACTIVITY", "openTime": 1559181600000 }] };
                        this.chapterListDataSource.next(fakeData['zones']);
                    }, 500);
                    return new Array();
                }
            }
        ));
    }

    getStagesInChapter(id: string, snackBar: MatSnackBar = null): Observable<any> {
        return this.http.get(this.origin + this.api.chapter + "/" + id + "/stage").pipe(map((res) => {
            if (res) {
                this.stageListDataSource.next(this._sortStageList(res['stages']));
            }
            return res['stages'];
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    if (!snackBar) {
                        alert('未能获取作战列表。可将以下信息提供给作者以便改进本网站：' + err.message);
                    } else {
                        snackBar.open("未能获取作战列表。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                    }
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        const fakeData = { "stages": [{ "specialDrop": [], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-1", "stageType": "MAIN", "normalDrop": [], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-01" }, { "specialDrop": ["30024"], "extraDrop": ["30021", "30041", "2001", "30022", "30042", "2002", "30023", "30043", "30083", "2003"], "code": "4-2", "stageType": "MAIN", "normalDrop": ["30023"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-02" }, { "specialDrop": [], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-3", "stageType": "MAIN", "normalDrop": ["2003"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-03" }, { "specialDrop": ["30074"], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-4", "stageType": "MAIN", "normalDrop": ["30073"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-04" }, { "specialDrop": ["30054"], "extraDrop": ["30031", "30051", "30032", "30052", "30033", "30053", "30093", "30103"], "code": "4-5", "stageType": "MAIN", "normalDrop": ["30053"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-05" }, { "specialDrop": ["30014"], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-6", "stageType": "MAIN", "normalDrop": ["30013"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-06" }, { "specialDrop": ["30084"], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-7", "stageType": "MAIN", "normalDrop": ["30083"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-07" }, { "specialDrop": ["30094"], "extraDrop": ["30031", "30051", "30032", "30052", "30033", "30053", "30093", "30103"], "code": "4-8", "stageType": "MAIN", "normalDrop": ["30093"], "zoneId": "main_4", "apCost": 21, "stageId": "main_04-08" }, { "specialDrop": ["30094"], "extraDrop": ["30031", "30051", "30032", "30052", "30033", "30053", "30093", "30103"], "code": "4-8", "stageType": "MAIN", "normalDrop": ["30093"], "zoneId": "main_4", "apCost": 21, "stageId": "main_04-08" }, { "specialDrop": ["30104"], "extraDrop": ["30031", "30051", "30032", "30052", "30033", "30053", "30093", "30103"], "code": "4-9", "stageType": "MAIN", "normalDrop": ["30103"], "zoneId": "main_4", "apCost": 21, "stageId": "main_04-09" }, { "specialDrop": ["30064"], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-10", "stageType": "MAIN", "normalDrop": ["30063"], "zoneId": "main_4", "apCost": 21, "stageId": "main_04-10" }, { "specialDrop": ["30044"], "extraDrop": ["30021", "30041", "2001", "30022", "30042", "2002", "30023", "30043", "30083", "2003"], "code": "S4-1", "stageType": "SUB", "normalDrop": ["30043"], "zoneId": "main_4", "apCost": 18, "stageId": "sub_04-1-1" }, { "specialDrop": [], "extraDrop": ["30031", "30051", "30032", "30052", "30033", "30053", "30093", "30103"], "code": "S4-2", "stageType": "SUB", "normalDrop": [], "zoneId": "main_4", "apCost": 18, "stageId": "sub_04-1-2" }, { "specialDrop": [], "extraDrop": ["30021", "30041", "2001", "30022", "30042", "2002", "30023", "30043", "30083", "2003"], "code": "S4-3", "stageType": "SUB", "normalDrop": [], "zoneId": "main_4", "apCost": 18, "stageId": "sub_04-1-3" }, { "specialDrop": [], "extraDrop": ["30021", "30041", "2001", "30022", "30042", "2002", "30023", "30043", "30083", "2003"], "code": "S4-4", "stageType": "SUB", "normalDrop": [], "zoneId": "main_4", "apCost": 18, "stageId": "sub_04-2-1" }, { "specialDrop": [], "extraDrop": ["30031", "30051", "30032", "30052", "30033", "30053", "30093", "30103"], "code": "S4-5", "stageType": "SUB", "normalDrop": [], "zoneId": "main_4", "apCost": 18, "stageId": "sub_04-2-2" }, { "specialDrop": [], "extraDrop": ["30021", "30041", "2001", "30022", "30042", "2002", "30023", "30043", "30083", "2003"], "code": "S4-6", "stageType": "SUB", "normalDrop": [], "zoneId": "main_4", "apCost": 21, "stageId": "sub_04-2-3" }, { "specialDrop": [], "extraDrop": ["30021", "30041", "2001", "30022", "30042", "2002", "30023", "30043", "30083", "2003"], "code": "S4-7", "stageType": "SUB", "normalDrop": [], "zoneId": "main_4", "apCost": 18, "stageId": "sub_04-3-1" }, { "specialDrop": [], "extraDrop": ["30031", "30051", "30032", "30052", "30033", "30053", "30093", "30103"], "code": "S4-8", "stageType": "SUB", "normalDrop": [], "zoneId": "main_4", "apCost": 18, "stageId": "sub_04-3-2" }, { "specialDrop": [], "extraDrop": ["30021", "30041", "2001", "30022", "30042", "2002", "30023", "30043", "30083", "2003"], "code": "S4-9", "stageType": "SUB", "normalDrop": ["2003"], "zoneId": "main_4", "apCost": 21, "stageId": "sub_04-3-3" }] };
                        this.stageListDataSource.next(this._sortStageList(fakeData['stages']));
                    }, 500);
                    return new Array();
                }
            }
        ));
    }

    getStage(id: string, snackBar: MatSnackBar = null): Observable<any> {
        return this.http.get(this.origin + this.api.stage + "/" + id).pipe(map((res) => {
            if (res) {
                this.stageDataSource.next(res);
            }
            return res;
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    if (!snackBar) {
                        alert('未能获取掉落列表。可将以下信息提供给作者以便改进本网站：' + err.message);
                    } else {
                        snackBar.open("未能获取掉落列表。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                    }
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        const fakeData = { "specialDrop": [{ "itemId": "30014", "itemType": "MATERIAL", "sortId": 34, "name": "提纯源岩", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30014.png", "rarity": 3 }], "extraDrop": [{ "itemId": "30011", "itemType": "MATERIAL", "sortId": 37, "name": "源岩", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30011.png", "rarity": 0 }, { "itemId": "30061", "itemType": "MATERIAL", "sortId": 41, "name": "破损装置", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30061.png", "rarity": 0 }, { "itemId": "30012", "itemType": "MATERIAL", "sortId": 36, "name": "固源岩", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30012.png", "rarity": 1 }, { "itemId": "30062", "itemType": "MATERIAL", "sortId": 40, "name": "装置", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30062.png", "rarity": 1 }, { "itemId": "30013", "itemType": "MATERIAL", "sortId": 35, "name": "固源岩组", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30013.png", "rarity": 2 }, { "itemId": "30063", "itemType": "MATERIAL", "sortId": 39, "name": "全新装置", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30063.png", "rarity": 2 }, { "itemId": "30073", "itemType": "MATERIAL", "sortId": 27, "name": "扭转醇", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30073.png", "rarity": 2 }, { "itemId": "3003", "itemType": "MATERIAL", "addTime": 1, "sortId": 20, "name": "赤金", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/3003.png", "rarity": 3 }], "code": "4-6", "stageType": "MAIN", "normalDrop": [{ "itemId": "30013", "itemType": "MATERIAL", "sortId": 35, "name": "固源岩组", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30013.png", "rarity": 2 }], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-06" };
                        this.stageDataSource.next(fakeData);
                    }, 500);
                    return new Array();
                }
            }
        ));
    }

    updateItemList(snackBar: MatSnackBar = null): Observable<any> {
        return this.http.get(this.origin + this.api.item).pipe(map((res) => {
            if (res) {
                this.itemListDataSource.next(this._sortItemList(res['items']));
            }
            return res['items'];
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    if (!snackBar) {
                        alert('未能获取素材列表。可将以下信息提供给作者以便改进本网站：' + err.message);
                    } else {
                        snackBar.open("未能获取素材列表。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                    }
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        const fakeData = { "items": [{ "itemId": "2004", "itemType": "CARD_EXP", "addTime": 1, "sortId": 12, "name": "高级作战记录", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/2004.png", "rarity": 4 }, { "itemId": "2003", "itemType": "CARD_EXP", "addTime": 1, "sortId": 13, "name": "中级作战记录", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/2003.png", "rarity": 3 }, { "itemId": "2002", "itemType": "CARD_EXP", "addTime": 1, "sortId": 14, "name": "初级作战记录", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/2002.png", "rarity": 2 }, { "itemId": "2001", "itemType": "CARD_EXP", "addTime": 1, "sortId": 15, "name": "基础作战记录", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/2001.png", "rarity": 1 }, { "itemId": "3003", "itemType": "MATERIAL", "addTime": 1, "sortId": 20, "name": "赤金", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/3003.png", "rarity": 3 }, { "itemId": "30074", "itemType": "MATERIAL", "sortId": 26, "name": "白马醇", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30074.png", "rarity": 3 }, { "itemId": "30073", "itemType": "MATERIAL", "sortId": 27, "name": "扭转醇", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30073.png", "rarity": 2 }, { "itemId": "30084", "itemType": "MATERIAL", "sortId": 28, "name": "三水锰矿", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30084.png", "rarity": 3 }, { "itemId": "30083", "itemType": "MATERIAL", "sortId": 29, "name": "轻锰矿", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30083.png", "rarity": 2 }, { "itemId": "30094", "itemType": "MATERIAL", "sortId": 30, "name": "五水研磨石", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30094.png", "rarity": 3 }, { "itemId": "30093", "itemType": "MATERIAL", "sortId": 31, "name": "研磨石", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30093.png", "rarity": 2 }, { "itemId": "30104", "itemType": "MATERIAL", "sortId": 32, "name": "RMA70-24", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30104.png", "rarity": 3 }, { "itemId": "30103", "itemType": "MATERIAL", "sortId": 33, "name": "RMA70-12", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30103.png", "rarity": 2 }, { "itemId": "30014", "itemType": "MATERIAL", "sortId": 34, "name": "提纯源岩", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30014.png", "rarity": 3 }, { "itemId": "30013", "itemType": "MATERIAL", "sortId": 35, "name": "固源岩组", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30013.png", "rarity": 2 }, { "itemId": "30012", "itemType": "MATERIAL", "sortId": 36, "name": "固源岩", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30012.png", "rarity": 1 }, { "itemId": "30011", "itemType": "MATERIAL", "sortId": 37, "name": "源岩", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30011.png", "rarity": 0 }, { "itemId": "30064", "itemType": "MATERIAL", "sortId": 38, "name": "改量装置", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30064.png", "rarity": 3 }, { "itemId": "30063", "itemType": "MATERIAL", "sortId": 39, "name": "全新装置", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30063.png", "rarity": 2 }, { "itemId": "30062", "itemType": "MATERIAL", "sortId": 40, "name": "装置", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30062.png", "rarity": 1 }, { "itemId": "30061", "itemType": "MATERIAL", "sortId": 41, "name": "破损装置", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30061.png", "rarity": 0 }, { "itemId": "30034", "itemType": "MATERIAL", "sortId": 42, "name": "聚酸酯块", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30034.png", "rarity": 3 }, { "itemId": "30033", "itemType": "MATERIAL", "sortId": 43, "name": "聚酸酯组", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30033.png", "rarity": 2 }, { "itemId": "30032", "itemType": "MATERIAL", "sortId": 44, "name": "聚酸酯", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30032.png", "rarity": 1 }, { "itemId": "30031", "itemType": "MATERIAL", "sortId": 45, "name": "酯原料", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30031.png", "rarity": 0 }, { "itemId": "30024", "itemType": "MATERIAL", "sortId": 46, "name": "糖聚块", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30024.png", "rarity": 3 }, { "itemId": "30023", "itemType": "MATERIAL", "sortId": 47, "name": "糖组", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30023.png", "rarity": 2 }, { "itemId": "30022", "itemType": "MATERIAL", "sortId": 48, "name": "糖", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30022.png", "rarity": 1 }, { "itemId": "30021", "itemType": "MATERIAL", "sortId": 49, "name": "代糖", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30021.png", "rarity": 0 }, { "itemId": "30044", "itemType": "MATERIAL", "sortId": 50, "name": "异铁块", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30044.png", "rarity": 3 }, { "itemId": "30043", "itemType": "MATERIAL", "sortId": 51, "name": "异铁组", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30043.png", "rarity": 2 }, { "itemId": "30042", "itemType": "MATERIAL", "sortId": 52, "name": "异铁", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30042.png", "rarity": 1 }, { "itemId": "30041", "itemType": "MATERIAL", "sortId": 53, "name": "异铁碎片", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30041.png", "rarity": 0 }, { "itemId": "30054", "itemType": "MATERIAL", "sortId": 54, "name": "酮阵列", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30054.png", "rarity": 3 }, { "itemId": "30053", "itemType": "MATERIAL", "sortId": 55, "name": "酮凝集组", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30053.png", "rarity": 2 }, { "itemId": "30052", "itemType": "MATERIAL", "sortId": 56, "name": "酮凝集", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30052.png", "rarity": 1 }, { "itemId": "30051", "itemType": "MATERIAL", "sortId": 57, "name": "双酮", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30051.png", "rarity": 0 }, { "itemId": "furni", "itemType": "FURN", "sortId": 9999, "name": "家具", "rarity": 0 }] };
                        this.itemListDataSource.next(this._sortItemList(fakeData['items']));
                    }, 500);
                    return new Array();
                }
            }
        ));
    }

    getItemResult(id: string, snackBar: MatSnackBar = null): Observable<any> {
        let observable: Observable<any>;
        if (this.isPersonal) {
            observable = this.http.post(this.origin + this.api.itemResult + id, {
                stageTimes: JSON.parse(localStorage.getItem("stageTimes")),
                dropMatrix: JSON.parse(localStorage.getItem("dropMatrix"))
            });
        } else {
            observable = this.http.get(this.origin + this.api.itemResult + id);
        }
        return observable.pipe(map((res) => {
            if (res) {
                res = this._sortItemResult(res);
                this.itemResultDataSource.next(res);
            }
            return res;
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    if (!snackBar) {
                        alert('获取结果失败。可将以下信息提供给作者以便改进本网站：' + err.message);
                    } else {
                        snackBar.open("获取结果失败。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                    }
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        let fakeItemResult = { "item": { "itemId": "30013", "itemType": "MATERIAL", "sortId": 35, "name": "固源岩组", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30013.png", "rarity": 2 }, "drops": [{ "times": 34, "quantity": 5, "stage": { "specialDrop": [], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-1", "stageType": "MAIN", "normalDrop": [], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-01" } }, { "times": 1610, "quantity": 45, "stage": { "specialDrop": ["30074"], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-4", "stageType": "MAIN", "normalDrop": ["30073"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-04" } }, { "times": 15, "quantity": 1, "stage": { "specialDrop": [], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-3", "stageType": "MAIN", "normalDrop": ["2003"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-03" } }, { "times": 1656, "quantity": 751, "stage": { "specialDrop": ["30014"], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-6", "stageType": "MAIN", "normalDrop": ["30013"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-06" } }, { "times": 1625, "quantity": 29, "stage": { "specialDrop": ["30084"], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-7", "stageType": "MAIN", "normalDrop": ["30083"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-07" } }, { "times": 562, "quantity": 24, "stage": { "specialDrop": ["30064"], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-10", "stageType": "MAIN", "normalDrop": ["30063"], "zoneId": "main_4", "apCost": 21, "stageId": "main_04-10" } }, { "times": 289, "quantity": 132, "stage": { "specialDrop": [], "extraDrop": ["30011", "30031", "30061", "3003", "30012", "30032", "30062", "2001"], "code": "2-4", "stageType": "MAIN", "normalDrop": ["30013"], "zoneId": "main_2", "apCost": 12, "stageId": "main_02-04" } }] };
                        fakeItemResult = this._sortItemResult(fakeItemResult);
                        this.itemResultDataSource.next(fakeItemResult);
                    }, 500);
                    return new Array();
                }
            }
        ));
    }

    getStageResult(id: string, snackBar: MatSnackBar = null): Observable<any> {
        let observable: Observable<any>;
        if (this.isPersonal) {
            observable = this.http.post(this.origin + this.api.stageResult + id, {
                stageTimes: JSON.parse(localStorage.getItem("stageTimes")),
                dropMatrix: JSON.parse(localStorage.getItem("dropMatrix"))
            });
        } else {
            observable = this.http.get(this.origin + this.api.stageResult + id);
        }
        return observable.pipe(map((res) => {
            if (res) {
                res = this._sortStageResult(res);
                this.stageResultDataSource.next(res);
            }
            return res;
        })).pipe(catchError(
            (err, caught) => {
                if (!this.isTest) {
                    if (!snackBar) {
                        alert('获取结果失败。可将以下信息提供给作者以便改进本网站：' + err.message);
                    } else {
                        snackBar.open("获取结果失败。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                    }
                    return throwError(err);
                } else {
                    setTimeout(() => {
                        let fakeStageResult = { "drops": [{ "times": 1656, "item": { "itemId": "30013", "itemType": "MATERIAL", "sortId": 35, "name": "固源岩组", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30013.png", "rarity": 2 }, "quantity": 751 }, { "times": 1656, "item": { "itemId": "30012", "itemType": "MATERIAL", "sortId": 36, "name": "固源岩", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30012.png", "rarity": 1 }, "quantity": 516 }, { "times": 1656, "item": { "itemId": "30014", "itemType": "MATERIAL", "sortId": 34, "name": "提纯源岩", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30014.png", "rarity": 3 }, "quantity": 81 }, { "times": 1656, "item": { "itemId": "30063", "itemType": "MATERIAL", "sortId": 39, "name": "全新装置", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30063.png", "rarity": 2 }, "quantity": 25 }, { "times": 1656, "item": { "itemId": "30011", "itemType": "MATERIAL", "sortId": 37, "name": "源岩", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30011.png", "rarity": 0 }, "quantity": 454 }, { "times": 670, "item": { "itemId": "3003", "itemType": "MATERIAL", "addTime": 1, "sortId": 20, "name": "赤金", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/3003.png", "rarity": 3 }, "quantity": 57 }, { "times": 1656, "item": { "itemId": "30062", "itemType": "MATERIAL", "sortId": 40, "name": "装置", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30062.png", "rarity": 1 }, "quantity": 198 }, { "times": 1656, "item": { "itemId": "30073", "itemType": "MATERIAL", "sortId": 27, "name": "扭转醇", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30073.png", "rarity": 2 }, "quantity": 35 }, { "times": 1656, "item": { "itemId": "furni", "itemType": "FURN", "sortId": 9999, "name": "家具", "rarity": 0 }, "quantity": 49 }, { "times": 1656, "item": { "itemId": "30061", "itemType": "MATERIAL", "sortId": 41, "name": "破损装置", "iconUrl": "https://s3.ap-southeast-1.amazonaws.com/penguin-stats-item-image/30061.png", "rarity": 0 }, "quantity": 172 }], "stage": { "specialDrop": ["30014"], "extraDrop": ["30011", "30061", "30012", "30062", "30013", "30063", "30073", "3003"], "code": "4-6", "stageType": "MAIN", "normalDrop": ["30013"], "zoneId": "main_4", "apCost": 18, "stageId": "main_04-06" } };
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
            return stageList;
        }
    }

    private _sortItemList(itemList) {
        if (itemList) {
            itemList.sort((a, b) => {
                if (a.name === '家具') {
                    return 1;
                } else if (b.name === '家具') {
                    return -1;
                } else if (a.name === '赤金') {
                    return 1;
                } else if (b.name === '赤金') {
                    return -1;
                } else {
                    return a.sortId - b.sortId;
                }
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
            if (a.item.itemId === 'furni') {
                return 1;
            }
            if (b.item.itemId === 'furni') {
                return -1;
            }
            return b.quantity - a.quantity;
        });
        return result;
    }

};