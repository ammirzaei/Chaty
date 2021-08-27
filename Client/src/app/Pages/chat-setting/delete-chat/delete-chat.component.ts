import { ChatSettingService } from 'src/app/Shared/Home/chat-setting.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-chat',
  templateUrl: './delete-chat.component.html',
  styleUrls: ['./delete-chat.component.css']
})
export class DeleteChatComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { ChatID: string }, private dialog: MatDialogRef<DeleteChatComponent>, private _ChatSettingService: ChatSettingService) { }

  ngOnInit(): void {
  }
  Delete() {
    this._ChatSettingService.DeleteChat(this.data.ChatID).subscribe(res => {
      if (res.status === 200) {
        this._ChatSettingService.ShareDeleteChat.next(this.data.ChatID);
        this.dialog.close();
      }
    })
  }
}
