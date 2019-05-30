import { Component, ElementRef, Renderer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PenguinService } from './service/penguin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  navbar_img: string;

  public constructor(private titleService: Title,  public penguinService: PenguinService, private el: ElementRef, private renderer: Renderer) {
    this.titleService.setTitle('Penguin Statistics - 明日方舟素材掉落统计');
    this.penguinService.getChapterList().subscribe();
    this.penguinService.updateItemList().subscribe();
    this.penguinService.isCollapsed = true;
    const r = Math.random();
    if (r < 0.25) {
      this.navbar_img = '../assets/navbar/exia.png';
    } else if (r < 0.5) {
      this.navbar_img = '../assets/navbar/texas.png';
    } else if (r < 0.75) {
      this.navbar_img = '../assets/navbar/sora.png';
    } else {
      this.navbar_img = '../assets/navbar/croissant.png';
    }
  }

  collapseNav() {
    this.renderer.setElementClass(this.el.nativeElement.querySelector('#navbarNavAltMarkup'), 'show', false);
  }
  
}
