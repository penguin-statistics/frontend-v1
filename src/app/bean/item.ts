import { Rarity } from './rarity';
import { ItemType } from './itemType';

export class Item {

    public id: number;
    public name: string;
    public img: string;
    public rarity: Rarity;
    public itemType: ItemType;

    constructor(id: number, name: string, img: string, rarity: Rarity, itemType: ItemType) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.rarity = rarity;
        this.itemType = itemType;
    }
    
};