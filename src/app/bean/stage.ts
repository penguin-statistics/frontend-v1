import { Item } from './item';

export class Stage {

    public id: number;
    public code: string;
    public normalDrop: Item[];
    public specialDrop: Item[];
    public extraDrop: Item[];

    constructor(id: number, code: string, normalDrop: Item[], specialDrop: Item[], extraDrop: Item[]) {
        this.id = id;
        this.code = code;
        this.normalDrop = normalDrop;
        this.specialDrop = specialDrop;
        this.extraDrop = extraDrop;
    }

};