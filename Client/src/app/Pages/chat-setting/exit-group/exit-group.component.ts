import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ChatSettingService } from 'src/app/Shared/Home/chat-setting.service';

@Component({
  selector: 'app-exit-group',
  templateUrl: './exit-group.component.html',
  styleUrls: ['./exit-group.component.css']
})
export class ExitGroupComponent implements OnInit {

  constructor(private dialog: MatDialogRef<ExitGroupComponent>, private _ChatSettingService: ChatSettingService, @Inject(MAT_DIALOG_DATA) private data: { ChatID: string }) { }

  ngOnInit(): void {
  }
  Exit() {
    this._ChatSettingService.ExitGroup(this.data.ChatID).subscribe(res => {
      if (res.status === 200) {
        this._ChatSettingService.ShareExitGroup.next(this.data.ChatID);
        this.dialog.close();
      }
    });
  }
}
