import { ProfileService } from 'src/app/Shared/Profile/profile.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { command: string, value: string }, private _ProfileService: ProfileService) { }

  ngOnInit(): void {
    this.Command = this.data.command;
  }
  Command: string;
  name: string = this.data.value;
  bio: string = this.data.value;
  OnSubmit() {
    if (this.Command === "نام") {
      this._ProfileService.EditProfileName(this.name.trim()).subscribe(res => { });
      this._ProfileService.ShareProfileInfoName.next(this.name);
      this._ProfileService.ShareProfileName.next(this.name);
    }
    if (this.Command === "بیو") {
      this._ProfileService.EditProfileBio(this.bio.trim()).subscribe(res => { });
      this._ProfileService.ShareProfileBio.next(this.bio);
    }
  }
}