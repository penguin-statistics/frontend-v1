import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
    selector: 'report-warning-dialog',
    templateUrl: 'dialog.report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportWarningDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<ReportWarningDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private router: Router) { }

    onBackClick() {
        this.dialogRef.close();
    }

    onConfirmClick() {
        this.dialogRef.close(true);
    }

    redirectToHomepage() {
        this.dialogRef.close();
        this.router.navigateByUrl('/');
    }

}