import { Item } from './item';

export class Stage {

    public stageID: number;
    public code: string;
    public normalDrop: Item[];
    public specialDrop: Item[];
    public extraDrop: Item[];

    constructor(id: number, code: string, normalDrop: Item[], specialDrop: Item[], extraDrop: Item[]) {
        this.stageID = id;
        this.code = code;
        this.normalDrop = normalDrop;
        this.specialDrop = specialDrop;
        this.extraDrop = extraDrop;
    }

};