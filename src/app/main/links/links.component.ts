import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {

    links: any = [];

    constructor() { }

    ngOnInit() {
        this.links.push({
            title: "明日方舟工具箱",
            author: "一只灰喵",
            features: [
                {
                    name: "公招查询",
                    color: "cyan"
                },
                {
                    name: "升级计算",
                    color: "green"
                },
                {
                    name: "材料需求计算",
                    color: "blue"
                },
                {
                    name: "刷图规划",
                    color: "blue"
                },
                {
                    name: "库存管理",
                    color: "grey"
                }
            ],
            url: "https://aktools.graueneko.xyz/"
        });
        this.links.push({
            title: "ARK TOOLS",
            author: "Laplace",
            features: [
                {
                    name: "角色查看",
                    color: "yellow"
                },
                {
                    name: "整合图鉴",
                    color: "black"
                },
                {
                    name: "材料需求计算",
                    color: "blue"
                },
                {
                    name: "刷图规划",
                    color: "blue"
                }
            ],
            url: "https://gachasalt.github.io/ArkToolDemo/#/"
        });
        this.links.push({
            title: "干员培养表",
            author: "凤瞳",
            features: [
                {
                    name: "角色查看",
                    color: "yellow"
                },
                {
                    name: "材料需求计算",
                    color: "blue"
                },
                {
                    name: "刷图规划",
                    color: "blue"
                },
                {
                    name: "库存管理",
                    color: "grey"
                }
            ],
            url: "https://ark-nights.com"
        });
        this.links.push({
            title: "刷素材一图流",
            author: "Kindle",
            features: [
                {
                    name: "理智效率排行",
                    color: "white"
                },
                {
                    name: "掉率排行",
                    color: "white"
                },
                {
                    name: "综合收益排行",
                    color: "white"
                }
            ],
            url: "https://dwz.cn/AkhN4Va6"
        });
    }

}
