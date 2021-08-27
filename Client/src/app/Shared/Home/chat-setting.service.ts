import { AllChats } from './../Chat/Chats';
import { EditnameGroupComponent } from './../../Pages/chat-setting/editname-group/editname-group.component';
import { ExitGroupComponent } from './../../Pages/chat-setting/exit-group/exit-group.component';
import { NameGroup, Profile, ProfileInfo, ProfileGroup } from './home';
import { AddUserComponent } from './../../Pages/chat-setting/add-user/add-user.component';
import { DeleteChatComponent } from './../../Pages/chat-setting/delete-chat/delete-chat.component';
import { catchError } from 'rxjs/operators';
import { DeleteHistoryComponent } from './../../Pages/chat-setting/delete-history/delete-history.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { ChatService } from '../Chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class ChatSettingService {

  constructor(private http: HttpClient, private router: Router, private matDialog: MatDialog) { }
  Error(error: HttpErrorResponse) {
    if (error.status === 401) {
      localStorage.clear();
      this.router.navigate(['/Account/Login']);
    }
    return throwError('لطفا دوباره تلاش کنید');
  }
  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });
  ShareResetSelectIndexSettingHome = new Subject<boolean>();
  SetResetIndexHome() {
    this.ShareResetSelectIndexSettingHome.next(true);
  }
  Dialog_DeleteHistory(chatId: string) {
    this.SetResetIndexHome();
    if (chatId !== null && chatId != "")
      this.matDialog.open(DeleteHistoryComponent, { data: { chatID: chatId } });
  }
  DeleteHistory(chatId: string) {
    return this.http.delete(environment.AddressBase + `/Chats/DeleteHistory/${chatId}`, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  ShareDeleteHistory = new Subject<string>();

  Dialog_DeleteChat(chatID: string) {
    this.SetResetIndexHome();
    if (chatID !== null && chatID != '')
      this.matDialog.open(DeleteChatComponent, { data: { ChatID: chatID } });
  }
  DeleteChat(chatID: string) {
    return this.http.delete(environment.AddressBase + `/Chats/DeleteChat/${chatID}`, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  ShareDeleteChat = new Subject<string>();

  Dialog_AddUserToGroup(chatID: string) {
    this.SetResetIndexHome();
    if (chatID !== null && chatID != '')
      this.matDialog.open(AddUserComponent, { data: { ChatId: chatID } });
  }
  GetResultSearchAddUser(chatID: string, mobile: string) {
    return this.http.get<ProfileInfo[]>(environment.AddressBase + `/Chats/GetResultAddUser/${chatID}/${mobile}`, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  AddUserToGroup(chatId: string, listUserId: string[]) {
    return this.http.post(environment.AddressBase + `/Chats/AddUserToGroup/${chatId}`, listUserId, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  ShareAddUserToGroup = new Subject<any>();

  Dialog_ExitGroup(chatID: string) {
    this.SetResetIndexHome();
    if (chatID !== null && chatID != '')
      this.matDialog.open(ExitGroupComponent, { data: { ChatID: chatID } });
  }
  ExitGroup(chatId: string) {
    return this.http.delete(environment.AddressBase + `/Chats/ExitGroup/${chatId}`, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  ShareExitGroup = new Subject<string>();

  Dialog_EditNameGroup(chatID: string, groupName: string) {
    this.SetResetIndexHome();
    if (chatID !== null && chatID != '' && groupName !== '')
      this.matDialog.open(EditnameGroupComponent, { data: { ChatID: chatID, GroupName: groupName } });
  }
  EditNameGroup(nameGroup: NameGroup) {
    return this.http.put(environment.AddressBase + "/Chats/EditNameGroup", nameGroup, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  ShareEditNameGroup = new Subject<NameGroup>();

  Show_GetProfileUser(ID: string) {
    this.SetResetIndexHome();
    this.router.navigate(['/User/Profile/User', ID]);
  }
  GetProfileUser(ID: string) {
    return this.http.get<Profile>(environment.AddressBase + `/Chats/GetProfileUser/${ID}`, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }

  Show_GetProfileGroup(chatID: string) {
    this.SetResetIndexHome();
    this.router.navigate(['/Profile/Group', chatID]);
  }
  GetProfileGroup(chatID: string) {
    return this.http.get<ProfileGroup>(environment.AddressBase + `/Chats/GetProfileGroup/${chatID}`, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
}
