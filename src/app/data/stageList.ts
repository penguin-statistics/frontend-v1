import { Stage } from "../bean/stage";
import { MaterialFactory } from '../util/materialFactory';
import { MaterialCategory } from '../bean/materialCategory';
import { Rarity } from '../bean/rarity';

let stageList = new Array();
stageList.push(
    new Stage(0, '3-8', [
        MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.BLUE)
    ], [
            MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.PURPLE)
        ], [
            MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.GRINDSTONE, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.RMA, Rarity.BLUE)
        ]),
    new Stage(1, '4-2', [
        // MaterialFactory.createMaterial(MaterialCategory.SUGAR, Rarity.BLUE)
    ], [
            MaterialFactory.createMaterial(MaterialCategory.SUGAR, Rarity.PURPLE)
        ], [
            MaterialFactory.createMaterial(MaterialCategory.SUGAR, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.IRON, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.SUGAR, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.IRON, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.SUGAR, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.IRON, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.MANGANESE, Rarity.BLUE)
        ]),
    new Stage(2, 'S4-1', [
        MaterialFactory.createMaterial(MaterialCategory.IRON, Rarity.BLUE)
    ], [
            MaterialFactory.createMaterial(MaterialCategory.IRON, Rarity.PURPLE)
        ], [
            MaterialFactory.createMaterial(MaterialCategory.SUGAR, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.IRON, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.SUGAR, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.IRON, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.SUGAR, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.IRON, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.MANGANESE, Rarity.BLUE)
        ]),
    new Stage(3, '4-4', [
        MaterialFactory.createMaterial(MaterialCategory.ALCOHOL, Rarity.BLUE)
    ], [
            // MaterialFactory.createMaterial(MaterialCategory.ALCOHOL, Rarity.PURPLE)
        ], [
            MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.ALCOHOL, Rarity.BLUE)
        ]),
    new Stage(4, '4-5', [
        MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.BLUE)
    ], [
            MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.PURPLE)
        ], [
            // MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.WHITE),
            // MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.WHITE),
            // MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.GREEN),
            // MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.GREEN),
            // MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.BLUE),
            // MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.BLUE),
            // MaterialFactory.createMaterial(MaterialCategory.GRINDSTONE, Rarity.BLUE),
            // MaterialFactory.createMaterial(MaterialCategory.RMA, Rarity.BLUE)
        ]),
    new Stage(5, '4-6', [
        MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.BLUE)
    ], [
            MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.PURPLE)
        ], [
            MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.ALCOHOL, Rarity.BLUE)
        ]),
    new Stage(6, '4-7', [
        // MaterialFactory.createMaterial(MaterialCategory.MANGANESE, Rarity.BLUE)
    ], [
            MaterialFactory.createMaterial(MaterialCategory.MANGANESE, Rarity.PURPLE)
        ], [
            // MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.WHITE),
            // MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.WHITE),
            // MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.GREEN),
            // MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.GREEN),
            // MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.BLUE),
            // MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.BLUE),
            // MaterialFactory.createMaterial(MaterialCategory.ALCOHOL, Rarity.BLUE)
        ]),
    new Stage(7, '4-8', [
        MaterialFactory.createMaterial(MaterialCategory.GRINDSTONE, Rarity.BLUE)
    ], [
            // MaterialFactory.createMaterial(MaterialCategory.GRINDSTONE, Rarity.PURPLE)
        ], [
            // MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.WHITE),
            // MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.WHITE),
            // MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.GREEN),
            // MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.GREEN),
            // MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.BLUE),
            // MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.BLUE),
            // MaterialFactory.createMaterial(MaterialCategory.GRINDSTONE, Rarity.BLUE),
            // MaterialFactory.createMaterial(MaterialCategory.RMA, Rarity.BLUE)
        ]),
    new Stage(8, '4-9', [
        // MaterialFactory.createMaterial(MaterialCategory.RMA, Rarity.BLUE)
    ], [
            // MaterialFactory.createMaterial(MaterialCategory.RMA, Rarity.PURPLE)
        ], [
            MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.ESTER, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.KETONE, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.GRINDSTONE, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.RMA, Rarity.BLUE)
        ]),
    new Stage(9, '4-10', [
        MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.BLUE)
    ], [
            MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.PURPLE)
        ], [
            MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.WHITE),
            MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.GREEN),
            MaterialFactory.createMaterial(MaterialCategory.ROCK, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.DEVICE, Rarity.BLUE),
            MaterialFactory.createMaterial(MaterialCategory.ALCOHOL, Rarity.BLUE)
        ])
);

export const StageList = stageList;