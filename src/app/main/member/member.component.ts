import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-member',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

    owner: any;
    profiles: any = [];

    constructor() { }

    ngOnInit() {
        this.owner = {
            name: "AlvISs_红白",
            responsibility: "前端 后端 运维",
            avatar: "hongbai.jpg",
            socials: {
                weibo: "https://www.weibo.com/u/6434065694",
                twitter: "https://twitter.com/AlvISs_Reimu",
                github: "https://github.com/AlvISsReimu",
                qq: "498704999"
            }
        };
        this.profiles.push({
            name: "🦀",
            responsibility: "ArkPlanner作者",
            avatar: "xie.jpeg",
            socials: {
                github: "https://github.com/ycremar"
            }
        });
        this.profiles.push({
            name: "YukiC",
            responsibility: "后端",
            avatar: "yukic.jpg",
            socials: {
                github: "https://github.com/cyj5230"
            }
        });
        this.profiles.push({
            name: "Galvin Gao",
            responsibility: "前端",
            avatar: "gg.png",
            socials: {
                github: "https://github.com/GalvinGao"
            }
        });
        this.profiles.push({
            name: "路夏早苗",
            responsibility: "前端",
            avatar: "sanae.jpeg",
            socials: {
                github: "https://github.com/RokaSanae"
            }
        });
        this.profiles.push({
            name: "Einzithy.D",
            responsibility: "统计分析",
            avatar: "j.png",
            socials: {
                github: "https://github.com/Einzithy-D"
            }
        });
        this.profiles.push({
            name: "Nemunemu",
            responsibility: "客服",
            avatar: "nemunemu.jpg",
            socials: {
                weibo: "https://www.weibo.com/nemunemu"
            }
        });
        this.profiles.push({
            name: "侠",
            responsibility: "logo画师",
            avatar: "xia.png",
            socials: {
                weibo: "https://www.weibo.com/u/2290638732"
            }
        });
        this.profiles.push({
            name: "SrO²",
            responsibility: "素材制作",
            avatar: "sr.png",
            socials: {
                github: "https://github.com/Strontium233"
            }
        });
        this.profiles.push({
            name: "水晶泡芙",
            responsibility: "素材提供",
            avatar: "paofu.png",
            socials: {
                github: "https://github.com/Evealicemier"
            }
        });
        this.profiles.push({
            name: "ChaosNiku",
            responsibility: null,
            avatar: "chaosniku.png",
            socials: {
                github: "https://github.com/ChaosNiku"
            }
        });
        this.profiles.push({
            name: "AsahiLuna",
            responsibility: null,
            avatar: "luna.png",
            socials: {
                github: "https://github.com/AsahiLuna"
            }
        });
    }

}
