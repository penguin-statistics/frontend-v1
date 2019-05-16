import { MaterialCategory } from '../bean/materialCategory';
import { Rarity } from '../bean/rarity';
import { MaterialList } from '../data/materialList';

export class MaterialFactory {

    public static createMaterial(category: MaterialCategory, rarity: Rarity) {
        if (category === MaterialCategory.ROCK) {
            switch (rarity) {
                case Rarity.WHITE: return MaterialList[0];
                case Rarity.GREEN: return MaterialList[1];
                case Rarity.BLUE: return MaterialList[2];
                case Rarity.PURPLE: return MaterialList[3];
            }
        } else if (category === MaterialCategory.DEVICE) {
            switch (rarity) {
                case Rarity.WHITE: return MaterialList[4];
                case Rarity.GREEN: return MaterialList[5];
                case Rarity.BLUE: return MaterialList[6];
                case Rarity.PURPLE: return MaterialList[7];
            }
        } else if (category === MaterialCategory.ESTER) {
            switch (rarity) {
                case Rarity.WHITE: return MaterialList[8];
                case Rarity.GREEN: return MaterialList[9];
                case Rarity.BLUE: return MaterialList[10];
                case Rarity.PURPLE: return MaterialList[11];
            }
        } else if (category === MaterialCategory.SUGAR) {
            switch (rarity) {
                case Rarity.WHITE: return MaterialList[12];
                case Rarity.GREEN: return MaterialList[13];
                case Rarity.BLUE: return MaterialList[14];
                case Rarity.PURPLE: return MaterialList[15];
            }
        } else if (category === MaterialCategory.IRON) {
            switch (rarity) {
                case Rarity.WHITE: return MaterialList[16];
                case Rarity.GREEN: return MaterialList[17];
                case Rarity.BLUE: return MaterialList[18];
                case Rarity.PURPLE: return MaterialList[19];
            }
        } else if (category === MaterialCategory.KETONE) {
            switch (rarity) {
                case Rarity.WHITE: return MaterialList[20];
                case Rarity.GREEN: return MaterialList[21];
                case Rarity.BLUE: return MaterialList[22];
                case Rarity.PURPLE: return MaterialList[23];
            }
        } else if (category === MaterialCategory.ALCOHOL) {
            switch (rarity) {
                case Rarity.BLUE: return MaterialList[24];
                case Rarity.PURPLE: return MaterialList[25];
            }
        } else if (category === MaterialCategory.MANGANESE) {
            switch (rarity) {
                case Rarity.BLUE: return MaterialList[26];
                case Rarity.PURPLE: return MaterialList[27];
            }
        } else if (category === MaterialCategory.GRINDSTONE) {
            switch (rarity) {
                case Rarity.BLUE: return MaterialList[28];
                case Rarity.PURPLE: return MaterialList[29];
            }
        } else if (category === MaterialCategory.RMA) {
            switch (rarity) {
                case Rarity.BLUE: return MaterialList[30];
                case Rarity.PURPLE: return MaterialList[31];
            }
        }
        return null;
    }

};

