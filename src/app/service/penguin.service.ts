import { HttpClient } from "@angular/common/http";
import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Stage } from '../interface/Stage';
import { Item } from '../interface/Item';

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

    private stageMapDataSource = new BehaviorSubject<any>(null);
    stageMapData = this.stageMapDataSource.asObservable();

    private itemListDataSource = new BehaviorSubject<any>(null);
    itemListData = this.itemListDataSource.asObservable();

    private itemMapDataSource = new BehaviorSubject<any>(null);
    itemMapData = this.itemMapDataSource.asObservable();

    private itemResultDataSource = new BehaviorSubject<any>(null);
    itemResultData = this.itemResultDataSource.asObservable();

    private stageResultDataSource = new BehaviorSubject<any>(null);
    stageResultData = this.stageResultDataSource.asObservable();

    isCollapsed = true;

    isTest = false;

    showStageType = false;

    isPersonal = false;

    version = "v1.0.0";

    constructor(private http: HttpClient) {
        this.isTest = isDevMode();

        this.chapterListDataSource.next(null);
        this.stageListDataSource.next(null);
        this.stageMapDataSource.next(null);
        this.itemListDataSource.next(null);
        this.itemMapDataSource.next(null);
        this.itemResultDataSource.next(null);
        this.stageResultDataSource.next(null);

        if (location.hostname === 'localhost') {
            this.origin = location.origin.replace(location.port, '8080');
        } else {
            this.origin = location.origin;
        }
    }

    getAllChapters(snackBar: MatSnackBar = null): Observable<any> {
        return this.http.get(this.origin + this.api.chapter).pipe(map((res) => {
            if (res) {
                this.chapterListDataSource.next(res['zones']);
            }
            return res['zones'];
        })).pipe(catchError(
            (err, caught) => {
                if (!snackBar) {
                    alert('未能获取章节列表。可将以下信息提供给作者以便改进本网站：' + err.message);
                } else {
                    snackBar.open("未能获取章节列表。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                }
                return throwError(err);
            }
        ));
    }

    getAllStages(snackBar: MatSnackBar = null): Observable<any> {
        return this.http.get(this.origin + this.api.stage).pipe(map((res) => {
            if (res) {
                this.stageMapDataSource.next(this._convertStageListToMap(res['stages']));
            }
            return res;
        })).pipe(catchError(
            (err, caught) => {
                if (!snackBar) {
                    alert('未能获取作战列表。可将以下信息提供给作者以便改进本网站：' + err.message);
                } else {
                    snackBar.open("未能获取作战列表。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                }
                return throwError(err);
            }
        ));
    }

    getAllItems(snackBar: MatSnackBar = null): Observable<any> {
        return this.http.get(this.origin + this.api.item).pipe(map((res) => {
            if (res) {
                this.itemListDataSource.next(this._sortItemList(res['items']));
                this.itemMapDataSource.next(this._convertItemListToMap(res['items']));
            }
            return res['items'];
        })).pipe(catchError(
            (err, caught) => {
                if (!snackBar) {
                    alert('未能获取素材列表。可将以下信息提供给作者以便改进本网站：' + err.message);
                } else {
                    snackBar.open("未能获取素材列表。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                }
                return throwError(err);
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
                if (!snackBar) {
                    alert('获取结果失败。可将以下信息提供给作者以便改进本网站：' + err.message);
                } else {
                    snackBar.open("获取结果失败。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                }
                return throwError(err);
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
                if (!snackBar) {
                    alert('获取结果失败。可将以下信息提供给作者以便改进本网站：' + err.message);
                } else {
                    snackBar.open("获取结果失败。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                }
                return throwError(err);
            }
        ));
    }

    private _convertStageListToMap(stages: Stage[]): any {
        let result: any = {};
        stages.forEach(stage => {
            result[stage.stageId] = stage;
        });
        return result;
    }

    private _convertItemListToMap(items: Item[]): any {
        let result: any = {};
        items.forEach(item => {
            result[item.itemId] = item;
        });
        return result;
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
