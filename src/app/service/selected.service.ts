import { Injectable } from '@angular/core';
import { Chapter } from '../interface/Chapter';
import { Stage } from '../interface/Stage';
import { Item } from '../interface/Item';

@Injectable({
    providedIn: 'root'
})
export class SelectedService {
    selections: {
        report: StageSelection,
        result_by_stage: StageSelection,
        result_by_item: ItemSelection
    }

    constructor() {
        this.selections = {
            report: null,
            result_by_stage: null,
            result_by_item: null
        };
        this.selections.report = {
            selectedChapter: null,
            selectedStage: null,
        };
        this.selections.result_by_stage = {
            selectedChapter: null,
            selectedStage: null,
        };
        this.selections.result_by_item = {
            selectedItem: null
        };
    }

}

interface StageSelection {
    selectedChapter: Chapter,
    selectedStage: Stage,
}

interface ItemSelection {
    selectedItem: Item
}