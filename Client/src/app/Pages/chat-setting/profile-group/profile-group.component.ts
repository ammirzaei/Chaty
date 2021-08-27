import { ProfileGroup } from './../../../Shared/Home/home';
import { Component, OnInit } from '@angular/core';
import { alertSetting } from '../../alert/alert';
import { ChatSettingService } from 'src/app/Shared/Home/chat-setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/Shared/Chat/chat.service';

@Component({
  selector: 'app-profile-group',
  templateUrl: './profile-group.component.html',
  styleUrls: ['./profile-group.component.css']
})
export class ProfileGroupComponent implements OnInit {

  constructor(private _ChatService: ChatService,private _ChatSettingService: ChatSettingService, private Route: ActivatedRoute, private router: Router) { }
  ChatID: string;
  ngOnInit(): void {
    this.Route.paramMap.subscribe(s => {
      this.ChatID = s.get('id');
      this._ChatSettingService.GetProfileGroup(this.ChatID).subscribe(res => {
        if (res.status === 200) {
          this.Profile = res.body;
        }
        if (res.status === 404) {
          this.router.navigate(['']);
        }
      });
    });
    this.SetOnlineUser(null);
  }
  Profile: ProfileGroup = new ProfileGroup();
  IsAlert: boolean = false;
  AlertData: alertSetting;
  ListOnline: string[] = [];
  StartAlert(setting: alertSetting) {
    if (this.IsAlert == false) {
      this.AlertData = setting;
      this.IsAlert = true;
    }
  }
  CloseAlert() {
    this.IsAlert = false;
  }
  SetOnlineUser(data: string[]) {
    this._ChatService.ShareAddOnlineUser.subscribe(res => {
      if (!this.ListOnline.find(s => s == res))
        this.ListOnline.push(res);
    });
    this._ChatService.ShareDeleteOnlineUser.subscribe(res => {
      if (this.ListOnline.find(s => s == res)) {
        let index = this.ListOnline.findIndex(s => s == res);
        this.ListOnline.splice(index, 1);
      }
    });
    if (data !== null)
      this.ListOnline = data;
  }
  CheckOnlineUser(userID: string): string {
    if (this.ListOnline.find(s => s == userID))
      return 'online';
    else
      return 'offline';
  }
}