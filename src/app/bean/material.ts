import { Item } from './item';
import { MaterialCategory } from './materialCategory';
import { Rarity } from './rarity';
import { ItemType } from './itemType';

export class Material extends Item {

    public category: MaterialCategory;

    constructor(id: number, name: string, img: string, rarity: Rarity, itemType: ItemType, category: MaterialCategory) {
        super(id, name, img, rarity, itemType);
        this.category = category;
    }

};