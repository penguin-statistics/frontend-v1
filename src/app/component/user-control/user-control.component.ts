import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PenguinService } from 'src/app/service/penguin.service';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { GoogleAnalyticsEventsService } from 'src/app/service/google-analytics-events-service';
import { UserControlDialogComponent } from './dialog.user-control.component';

@Component({
    selector: 'user-control',
    templateUrl: './user-control.component.html',
    styleUrls: ['./user-control.component.scss']
})
export class UserControlComponent implements OnInit {

    @Output() loginSuccess = new EventEmitter<string>();

    userID: string = null;

    constructor(public penguinService: PenguinService,
        private cookieService: CookieService,
        private http: HttpClient,
        private _snackBar: MatSnackBar,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
        public dialog: MatDialog) { }

    ngOnInit(): void {
        this.refresh();
    }

    login() {
        this._openDialog();
    }

    refresh() {
        this.userID = this.cookieService.get("userID");
    }

    private _openDialog(): void {
        const dialogRef = this.dialog.open(UserControlDialogComponent, {
            width: '400px',
            data: {
                title: this.userID ? '切换账号' : '登录'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.http.post(this.penguinService.origin + this.penguinService.api.user, result).subscribe(
                    (val) => {
                        this.googleAnalyticsEventsService.emitEvent("login", this.userID ? 'login_switch' : 'login', "login_success", 1);
                        this._snackBar.open("登录成功", "", { duration: 2000 });
                        this.userID = val['userID'];
                        this.loginSuccess.emit(this.userID);
                    },
                    error => {
                        this._snackBar.open("用户ID不存在，请重试", "", { duration: 2000 });
                    },
                    () => { }
                );
            }
        });
    }

}