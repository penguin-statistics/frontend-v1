import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PenguinService } from 'src/app/service/penguin.service';
import { MatSnackBar } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.scss']
})

export class DataSourceComponent implements OnInit {

  @Output() refreshResult = new EventEmitter<boolean>();

  constructor(
    public penguinService: PenguinService,
    private _snackBar: MatSnackBar,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
  }

  selectDataSource(isPersonal: boolean) {
    if (this.penguinService.isPersonal === isPersonal) {
      return;
    }
    if (isPersonal) {
      const userID: string = this.cookieService.get("userID");
      if (!userID) {
        this._snackBar.open(
          "您当前未登录，无法获取完整个人上传数据。", "x", { duration: 3000 }
        );
      }
    }
    this.penguinService.isPersonal = isPersonal;
    this.refreshResult.emit();
  }
}
