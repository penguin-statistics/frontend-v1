import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'user-control-dialog',
    templateUrl: 'dialog.user-control.component.html',
    styleUrls: ['./user-control.component.scss']
})
export class UserControlDialogComponent implements OnInit {

    title: string = null;
    userID: string = null;

    constructor(
        public dialogRef: MatDialogRef<UserControlDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        this.title = this.data['title'];
    }

    onBackClick() {
        this.dialogRef.close(null);
    }

    onConfirmClick() {
        this.dialogRef.close(this.userID);
    }

}