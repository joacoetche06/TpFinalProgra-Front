import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-session',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './confirm-session.component.html',
  styleUrl: './confirm-session.component.css',
})
export class ConfirmSessionComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmSessionComponent>
  ) {}

  onYes() {
    this.dialogRef.close(true);
  }

  onNo() {
    this.dialogRef.close(false);
  }
}
