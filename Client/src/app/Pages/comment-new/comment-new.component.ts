import { ProfileInfo } from './../../Shared/Home/home';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/Shared/Home/home.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-new',
  templateUrl: './comment-new.component.html',
  styleUrls: ['./comment-new.component.css']
})
export class CommentNewComponent {
  constructor(private _HomeService: HomeService, private dialog: MatDialogRef<CommentNewComponent>) { }
  ResultSearch: ProfileInfo[] = [];
  ListSelectUser: string[] = [];
  @ViewChild('mobile') InputMobile: ElementRef;
  IsStartSearch: boolean = false;
  GetResultSearch() {
    let mobile = this.InputMobile.nativeElement.value.trim();
    if (mobile != null && mobile != '') {
      this.IsStartSearch = true;
      this._HomeService.GetResultSearchMobile(mobile).subscribe(res => {
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
  StartContact() {
    if (this.ListSelectUser.length > 0) {
      this._HomeService.StartContact(this.ListSelectUser).subscribe(res => {
        if (res.status === 200) {
          this._HomeService.ShareAddChat.next(res.body);
          this.dialog.close();
        }
      });
    }
  }
  Typing(event: any) {
    if (event.keyCode === 13)
      this.GetResultSearch()
  }
  CompressProfileName(name: string) {   
    return name.substring(0, 1);
  }
}