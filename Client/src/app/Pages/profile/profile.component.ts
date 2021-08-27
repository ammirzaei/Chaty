import { HomeComponent } from './../home/home.component';
import { ProfileService } from './../../Shared/Profile/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/Shared/Home/home';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { alertSetting } from '../alert/alert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private _ProfileService: ProfileService, private matDialog: MatDialog, private _HomeComponent: HomeComponent) { }

  ngOnInit(): void {
    this.Shared();
    this._ProfileService.GetProfile().subscribe(data => {
      this.Profile = data;
      if (data.imageName === null)
        this.CompreesProfileName(data.name);
    });
  }
  ProfileNameCompress: string = '';
  Profile: Profile = new Profile();
  Command = CommandProfile;
  EditProfile(command: CommandProfile) {
    if (command === CommandProfile.EditName) {
      if (this.Profile.name === this.Profile.mobile) {
        this.matDialog.open(EditProfileComponent, { data: { command: 'نام', value: '' } });
      } else {
        this.matDialog.open(EditProfileComponent, { data: { command: 'نام', value: this.Profile.name } });
      }
    }
    if (command === CommandProfile.EditBio) {
      this.matDialog.open(EditProfileComponent, { data: { command: 'بیو', value: this.Profile.bio } });
    }
  }
  OnChangeAvatar(event: any) {
    let file = <File>event.target.files[0];
    if (file != null) {
      const formData = new FormData();
      formData.append('file', file);
      this._ProfileService.EditProfileAvatar(formData).subscribe(res => {
        if (res.status === 200) {
          if (res.body.hasOwnProperty('imageName')) {
            this._ProfileService.ShareProfileAvatar.next(res.body['imageName']);
          }
        }
        if (res.status === 204) {
          this.StartAlert(new alertSetting('bg-red', 'لطفا فقط عکس آپلود کنید', true, 0));
        }
      });
    }
  }
  CompreesProfileName(name: string) {
    this.ProfileNameCompress = name.substring(0, 1) + '...';
  }
  Shared() {
    this._ProfileService.ShareProfileBio.subscribe(res => {
      console.log(res);
      this.Profile.bio = res;
    });
    this._ProfileService.ShareProfileName.subscribe(res => {
      this.Profile.name = res;
      this.CompreesProfileName(res);
    });
    this._ProfileService.ShareProfileAvatar.subscribe(res => {
      this.Profile.imageName = res
    });
  }
  IsAlert: boolean = false;
  AlertData: alertSetting;
  StartAlert(setting: alertSetting) {
    if (this.IsAlert == false) {
      this.AlertData = setting;
      this.IsAlert = true;
    }
  }
  CloseAlert() {
    this.IsAlert = false;
  }
  LogOut() {
    this._HomeComponent.LogOut();
  }
}
enum CommandProfile {
  EditName,
  EditBio
}