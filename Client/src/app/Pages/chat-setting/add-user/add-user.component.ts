import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileInfo } from './../../../Shared/Home/home';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ChatSettingService } from 'src/app/Shared/Home/chat-setting.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  constructor(private _ChatSettingsService: ChatSettingService, @Inject(MAT_DIALOG_DATA) private data: { ChatId: string }, private dialog: MatDialogRef<AddUserComponent>) { }

  ResultSearch: ProfileInfo[] = new Array<ProfileInfo>();
  ListSelectUser: string[] = [];
  IsStartSearch: boolean = false;
  @ViewChild('mobile') InputMobile: ElementRef;
  Add() {
    if (this.ListSelectUser.length > 0) {
      this._ChatSettingsService.AddUserToGroup(this.data.ChatId, this.ListSelectUser).subscribe(res => {
        if (res.status === 200) {
          this.ListSelectUser.push(this.data.ChatId);
          this._ChatSettingsService.ShareAddUserToGroup.next(this.ListSelectUser);
          this.dialog.close();
        }
      });
    }
  }
  GetResultSearch() {
    let mobile = this.InputMobile.nativeElement.value.trim();
    if (mobile != null && mobile != '') {
      this.IsStartSearch = true;
      this._ChatSettingsService.GetResultSearchAddUser(this.data.ChatId, mobile).subscribe(res => {
        if (res.status === 200) {
          if (res.body != this.ResultSearch)
            this.ResultSearch = res.body;
        }
      });
    } else {
      this.ResultSearch = [];
    }
  }
    CheckExistUser(userId: string): boolean {
    if (this.ListSelectUser.find(s => s == userId))
      return true;
    else
      return false;
  }
  SelectUser(profileInfo: ProfileInfo) {
    let userId = this.ResultSearch.find(s => s == profileInfo).userID;
    if (this.ListSelectUser.find(s => s == userId)) {
      let index = this.ListSelectUser.findIndex(s => s == userId);
      this.ListSelectUser.splice(index, 1);
    }
    else
      this.ListSelectUser.push(userId);
  }
  Typing(event: any) {
    if (event.keyCode === 13)
      this.GetResultSearch()
  }
  CompressProfileName(name: string) {   
    return name.substring(0, 1);
  }
}
