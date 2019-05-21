import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PenguinService } from 'src/app/service/penguin.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  selectedStage: any = null;
  stageType: string = null;

  constructor(private http: HttpClient, private penguinService: PenguinService) { }

  ngOnInit() {
  }

  selectStage(stage: any) {
    if (this.selectedStage === stage) {
      return;
    }
    this.selectedStage = stage;
    this.stageType = 'normal';
  }

  selectStageType(stageType: string) {
    this.stageType = stageType;
  }

}
