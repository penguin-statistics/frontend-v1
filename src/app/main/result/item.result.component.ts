import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PenguinService } from 'src/app/service/penguin.service';
import { SelectedService } from 'src/app/service/selected.service';

@Component({
    selector: 'app-result',
    templateUrl: './item.result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ItemResultComponent implements OnInit {

    itemList: any = [];
    itemResult: any = null;
    isLoading: boolean = false;

    constructor(private http: HttpClient, public penguinService: PenguinService, public selectedService: SelectedService) { }

    ngOnInit() {
        this.penguinService.itemListData.subscribe(res => {
            if (res) {
                this.itemList = res;
            }
        });
        this._refreshItemResult();
    }

    selectItem(item) {
        this.selectedService.selections.result_by_item.selectedItem = item;
        this._refreshItemResult();
    }

    private _refreshItemResult() {
        if (this.selectedService.selections.result_by_item.selectedItem != null && this.selectedService.selections.result_by_item.selectedItem.id != null) {
            this.isLoading = true;
            this.http.get("/PenguinStats/api/result/item/" + this.selectedService.selections.result_by_item.selectedItem.id)
                .subscribe(
                    (val) => {
                        this.itemResult = val;
                        this._sortItemResult();
                        this.isLoading = false;
                    },
                    error => {
                        alert('获取结果失败。\n' + error.message + "\n如果可以的话希望能将以上信息提供给作者，谢谢！");
                        // this.itemResult = {"item":{"img":"http://p3.qhimg.com/dr/100__/t018a302bcf4e1fb3c1.png","itemType":"material","name":"聚酸酯组","id":10,"materialCategory":"ester","rarity":2},"drops":[{"times":46,"quantity":1,"stage":{"specialDrop":[23],"extraDrop":[8,9,10,20,21,22,28,30],"code":"4-5","stageType":"normal","normalDrop":[22],"id":4,"apCost":18}},{"times":48,"quantity":1,"stage":{"specialDrop":[31],"extraDrop":[8,9,10,20,21,22,28,30],"code":"4-9","stageType":"normal","normalDrop":[30],"id":8,"apCost":21}},{"times":5,"quantity":1,"stage":{"specialDrop":[11],"extraDrop":[8,9,10,20,21,22,28,30],"code":"3-8","stageType":"normal","normalDrop":[10],"id":0,"apCost":18}}]}
                        // this._sortItemResult();
                        this.isLoading = false;
                    },
                    () => {
                    });
        }
    }

    private _sortItemResult() {
        if (!this.itemResult) {
            return;
        }
        this.itemResult.drops.sort((a, b) => {
            return b.quantity / b.times - a.quantity / a.times;
        });
    }

}
