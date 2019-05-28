import { Component, ElementRef, Renderer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PenguinService } from './service/penguin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public constructor(private titleService: Title,  public penguinService: PenguinService, private el: ElementRef, private renderer: Renderer) {
    this.titleService.setTitle('Penguin Statistics - 明日方舟素材掉落统计');
    this.penguinService.getChapterList().subscribe();
    this.penguinService.updateItemList().subscribe();
    this.penguinService.isCollapsed = true;
  }

  collapseNav() {
    this.renderer.setElementClass(this.el.nativeElement.querySelector('#navbarNavAltMarkup'), 'show', false);
  }
  
}
