import { NameGroup } from './../../../Shared/Home/home';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatSettingService } from 'src/app/Shared/Home/chat-setting.service';

@Component({
  selector: 'app-editname-group',
  templateUrl: './editname-group.component.html',
  styleUrls: ['./editname-group.component.css']
})
export class EditnameGroupComponent implements OnInit {

  constructor(private _ChatSettingService: ChatSettingService, @Inject(MAT_DIALOG_DATA) public data: { ChatID: string, GroupName: string }, private dialog: MatDialogRef<EditnameGroupComponent>) { }
  @ViewChild('groupName') private groupName: ElementRef;
  ngOnInit(): void {
  }
  ChangeName() {
    var name = this.groupName.nativeElement.value.trim();
    if (name != "" && name != null && name != this.data.GroupName) {
      let model: NameGroup = new NameGroup(this.data.ChatID, name);
      this._ChatSettingService.EditNameGroup(model).subscribe(res => {
        if (res.status === 200) {
          this._ChatSettingService.ShareEditNameGroup.next(model);
          this.dialog.close();
        }
      });
    } else
      this.dialog.close();
  }
}
