import { Profile } from 'src/app/Shared/Home/home';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatSettingService } from 'src/app/Shared/Home/chat-setting.service';
import { ChatService } from 'src/app/Shared/Chat/chat.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {
  ID: string;
  constructor(private _ChatService: ChatService, private route: ActivatedRoute, private router: Router, private _ChatSettingService: ChatSettingService) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(s => {
      this.ID = s.get('id');
      this._ChatSettingService.GetProfileUser(this.ID).subscribe(res => {
        if (res.status === 200) {
          this.Profile = res.body;
        }
        if (res.status === 404)
          this.router.navigate([""]);
      });
    });

    this.SetOnlineUser(null);
  }
  userId: string;
  Profile: Profile = new Profile();
  IsOnline: boolean;
  SetOnlineUser(data: string[]) {
    this._ChatService.ShareAddOnlineUser.subscribe((userID: string) => {
      if (userID === this.Profile.userID)
        this.IsOnline = true;
    });
    this._ChatService.ShareDeleteOnlineUser.subscribe((userID: string) => {
      if (userID === this.Profile.userID)
        this.IsOnline = false;
    });
    if (data !== null)
      if (data.find(s => s == this.Profile.userID))
        this.IsOnline = true;
      else
        this.IsOnline = false;

  }
}