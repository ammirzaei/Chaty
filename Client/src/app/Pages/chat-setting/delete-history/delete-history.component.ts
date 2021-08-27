import { ChatSettingService } from 'src/app/Shared/Home/chat-setting.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-history',
  templateUrl: './delete-history.component.html',
  styleUrls: ['./delete-history.component.css']
})
export class DeleteHistoryComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { chatID: string }, private dialog: MatDialogRef<DeleteHistoryComponent>, private _ChatSettingService: ChatSettingService) { }

  ngOnInit(): void {

  }
  Delete() {
    this._ChatSettingService.DeleteHistory(this.data.chatID).subscribe(res => {
      if (res.status === 200) {
        this._ChatSettingService.ShareDeleteHistory.next(res.body["userId"]);
        this.dialog.close();
      }
    });
  }
}
