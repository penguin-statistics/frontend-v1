import { Material } from '../bean/material';
import { Rarity } from '../bean/rarity';
import { ItemType } from '../bean/itemType';
import { MaterialCategory } from '../bean/materialCategory';

let materialList = new Array();
materialList.push(
    new Material(0, '源岩', 'http://p0.qhimg.com/dr/100__/t01ad2e7fb00256fd86.png', Rarity.WHITE, ItemType.MATERIAL, MaterialCategory.ROCK),
    new Material(1, '固源岩', 'http://p7.qhimg.com/dr/100__/t0199099c5b08a71a7c.png', Rarity.GREEN, ItemType.MATERIAL, MaterialCategory.ROCK),
    new Material(2, '固源岩组', 'http://p0.qhimg.com/dr/100__/t01e388e4bd786583cc.png', Rarity.BLUE, ItemType.MATERIAL, MaterialCategory.ROCK),
    new Material(3, '提纯源岩', 'http://p1.qhimg.com/dr/100__/t0155cbcc61b719b8f0.png', Rarity.PURPLE, ItemType.MATERIAL, MaterialCategory.ROCK),
    new Material(4, '破损装置', 'http://p0.qhimg.com/dr/100__/t01d215deb8b5d92450.png', Rarity.WHITE, ItemType.MATERIAL, MaterialCategory.DEVICE),
    new Material(5, '装置', 'http://p7.qhimg.com/dr/100__/t0168ce9414da96fd12.png', Rarity.GREEN, ItemType.MATERIAL, MaterialCategory.DEVICE),
    new Material(6, '全新装置', 'http://p5.qhimg.com/dr/100__/t011e4890ca178623a8.png', Rarity.BLUE, ItemType.MATERIAL, MaterialCategory.DEVICE),
    new Material(7, '改量装置', 'http://p4.qhimg.com/dr/100__/t01dc064d4cf451a714.png', Rarity.PURPLE, ItemType.MATERIAL, MaterialCategory.DEVICE),
    new Material(8, '酯原料', 'http://p5.qhimg.com/dr/100__/t011d4cc2a098c6db6b.png', Rarity.WHITE, ItemType.MATERIAL, MaterialCategory.ESTER),
    new Material(9, '聚酸酯', 'http://p8.qhimg.com/dr/100__/t01c0d03b86a720ed81.png', Rarity.GREEN, ItemType.MATERIAL, MaterialCategory.ESTER),
    new Material(10, '聚酸酯组', 'http://p3.qhimg.com/dr/100__/t018a302bcf4e1fb3c1.png', Rarity.BLUE, ItemType.MATERIAL, MaterialCategory.ESTER),
    new Material(11, '聚酸酯块', 'http://p6.qhimg.com/dr/100__/t0140ddb0ef74b6d019.png', Rarity.PURPLE, ItemType.MATERIAL, MaterialCategory.ESTER),
    new Material(12, '代糖', 'http://p2.qhimg.com/dr/100__/t01a5d1fe85a7273fdd.png', Rarity.WHITE, ItemType.MATERIAL, MaterialCategory.SUGAR),
    new Material(13, '糖', 'http://p6.qhimg.com/dr/100__/t01b6d8d6c9998565fa.png', Rarity.GREEN, ItemType.MATERIAL, MaterialCategory.SUGAR),
    new Material(14, '糖组', 'http://p2.qhimg.com/dr/100__/t015eff31651f0d8fe3.png', Rarity.BLUE, ItemType.MATERIAL, MaterialCategory.SUGAR),
    new Material(15, '糖聚块', 'http://p7.qhimg.com/dr/100__/t013b71d436c3f8e5bd.png', Rarity.PURPLE, ItemType.MATERIAL, MaterialCategory.SUGAR),
    new Material(16, '异铁碎片', 'http://p9.qhimg.com/dr/100__/t0170a9d3b60ef3e114.png', Rarity.WHITE, ItemType.MATERIAL, MaterialCategory.IRON),
    new Material(17, '异铁', 'http://p3.qhimg.com/dr/100__/t01544eceac5ae76955.png', Rarity.GREEN, ItemType.MATERIAL, MaterialCategory.IRON),
    new Material(18, '异铁组', 'http://p6.qhimg.com/dr/100__/t0165da6420a9d69ad8.png', Rarity.BLUE, ItemType.MATERIAL, MaterialCategory.IRON),
    new Material(19, '异铁块', 'http://p2.qhimg.com/dr/100__/t01732fac1758731a73.png', Rarity.PURPLE, ItemType.MATERIAL, MaterialCategory.IRON),
    new Material(20, '双酮', 'http://p6.qhimg.com/dr/100__/t01ad3c2924abc2513b.png', Rarity.WHITE, ItemType.MATERIAL, MaterialCategory.KETONE),
    new Material(21, '酮凝集', 'http://p1.qhimg.com/dr/100__/t01cc0d9ad8829eac3e.png', Rarity.GREEN, ItemType.MATERIAL, MaterialCategory.KETONE),
    new Material(22, '酮凝集组', 'http://p6.qhimg.com/dr/100__/t01c37064c88e45a993.png', Rarity.BLUE, ItemType.MATERIAL, MaterialCategory.KETONE),
    new Material(23, '酮阵列', 'http://p9.qhimg.com/dr/100__/t0197adebf585be3d88.png', Rarity.PURPLE, ItemType.MATERIAL, MaterialCategory.KETONE),
    new Material(24, '扭转醇', 'http://p5.qhimg.com/dr/100__/t012969254d8c583793.png', Rarity.BLUE, ItemType.MATERIAL, MaterialCategory.ALCOHOL),
    new Material(25, '白马醇', 'http://p1.qhimg.com/dr/100__/t01c8174ac69b3ab03a.png', Rarity.PURPLE, ItemType.MATERIAL, MaterialCategory.ALCOHOL),
    new Material(26, '轻锰矿', 'http://p9.qhimg.com/dr/100__/t01b911608df7732dc3.png', Rarity.BLUE, ItemType.MATERIAL, MaterialCategory.MANGANESE),
    new Material(27, '三水锰矿', 'http://p3.qhimg.com/dr/100__/t01ad1555bd12de0fda.png', Rarity.PURPLE, ItemType.MATERIAL, MaterialCategory.MANGANESE),
    new Material(28, '研磨石', 'http://p3.qhimg.com/dr/100__/t017c06993962387008.png', Rarity.BLUE, ItemType.MATERIAL, MaterialCategory.GRINDSTONE),
    new Material(29, '五水研磨石', 'http://p1.qhimg.com/dr/100__/t01e5c874a7617e8aa8.png', Rarity.PURPLE, ItemType.MATERIAL, MaterialCategory.GRINDSTONE),
    new Material(30, 'RMA70-12', 'http://p5.qhimg.com/dr/100__/t0142c054e9a5306f4f.png', Rarity.BLUE, ItemType.MATERIAL, MaterialCategory.RMA),
    new Material(31, 'RMA70-24', 'http://p4.qhimg.com/dr/100__/t0166165d5abd32b94b.png', Rarity.PURPLE, ItemType.MATERIAL, MaterialCategory.RMA)
);

export const MaterialList = materialList;