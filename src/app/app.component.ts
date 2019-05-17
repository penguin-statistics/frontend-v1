import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public constructor(private titleService: Title) {
    this.titleService.setTitle('Penguin Statistics - 明日方舟素材掉落统计');
  }
  
}
