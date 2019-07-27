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
        chapter: "/PenguinStats/api/zones",
        stage: "/PenguinStats/api/stages",
        item: "/PenguinStats/api/items",
        stageResult: "/PenguinStats/api/result/stage/",
        itemResult: "/PenguinStats/api/result/item/",
        report: "/PenguinStats/api/report",
        limitation: "/PenguinStats/api/limitations",
        user: "/PenguinStats/api/users"
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

    private limitationMapDataSource = new BehaviorSubject<any>(null);
    limitationMapData = this.limitationMapDataSource.asObservable();

    isCollapsed = true;

    isTest = false;

    showStageType = false;

    isPersonal = false;

    version = "v1.4.5";

    constructor(private http: HttpClient) {
        this.isTest = isDevMode();

        this.chapterListDataSource.next(null);
        this.stageListDataSource.next(null);
        this.stageMapDataSource.next(null);
        this.itemListDataSource.next(null);
        this.itemMapDataSource.next(null);
        this.itemResultDataSource.next(null);
        this.stageResultDataSource.next(null);
        this.limitationMapDataSource.next(null);

        if (location.hostname === 'localhost') {
            this.origin = location.origin.replace(location.port, '8080');
        } else {
            this.origin = location.origin;
        }
    }

    getAllChapters(snackBar: MatSnackBar = null): Observable<any> {
        return this.http.get(this.origin + this.api.chapter).pipe(map((res) => {
            if (res) {
                this.chapterListDataSource.next(this._sortChapterList(res));
            }
            return res;
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
                this.stageMapDataSource.next(this._convertListToMap(res, 'stageId'));
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
                this.itemListDataSource.next(this._sortItemList(res));
                this.itemMapDataSource.next(this._convertListToMap(res, 'itemId'));
            }
            return res;
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

    getLimitations(snackBar: MatSnackBar = null): Observable<any> {
        return this.http.get(this.origin + this.api.limitation).pipe(map((res) => {
            if (res) {
                this.limitationMapDataSource.next(this._convertListToMap(res, 'name'));
            }
            return res;
        })).pipe(catchError(
            (err, caught) => {
                if (!snackBar) {
                    alert('未能获取汇报设置。可将以下信息提供给作者以便改进本网站：' + err.message);
                } else {
                    snackBar.open("未能获取汇报设置。可将以下信息提供给作者以便改进本网站：" + err.message, "x");
                }
                return throwError(err);
            }
        ));
    }

    getItemResult(id: string, snackBar: MatSnackBar = null): Observable<any> {
        let observable: Observable<any>;
        if (this.isPersonal) {
            let payload: any = {};
            const stageTimesStr = localStorage.getItem("stageTimes");
            const dropMatrixStr = localStorage.getItem("dropMatrix");
            if (stageTimesStr && dropMatrixStr) {
                payload.stageTimes = JSON.parse(stageTimesStr);
                payload.dropMatrix = JSON.parse(dropMatrixStr);
            }
            observable = this.http.post(this.origin + this.api.itemResult + id, payload);
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
            let payload: any = {};
            const stageTimesStr = localStorage.getItem("stageTimes");
            const dropMatrixStr = localStorage.getItem("dropMatrix");
            if (stageTimesStr && dropMatrixStr) {
                payload.stageTimes = JSON.parse(stageTimesStr);
                payload.dropMatrix = JSON.parse(dropMatrixStr);
            }
            observable = this.http.post(this.origin + this.api.stageResult + id, payload);
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

    private _convertListToMap(list: any, key: string): any {
        let result: any = {};
        list.forEach(item => {
            result[item[key]] = item;
        });
        return result;
    }

    private _sortChapterList(chapterList) {
        if (chapterList) {
            chapterList.sort((a, b) => {
                if (a.type === b.type) {
                    return a.zoneId.localeCompare(b.zoneId);
                } else if (a.type === 'MAINLINE') {
                    return -1;
                } else if (b.type === 'MAINLINE') {
                    return 1;
                } else {
                    return a.zoneId.localeCompare(b.zoneId);
                }
            });
            return chapterList;
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
