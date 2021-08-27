import { AllChats } from './../../Shared/Chat/Chats';
import { ProfileInfo, NameGroup } from './../../Shared/Home/home';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { CommentNewComponent } from '../comment-new/comment-new.component';
import { ProfileService } from 'src/app/Shared/Profile/profile.service';
import { HomeService } from 'src/app/Shared/Home/home.service';
import { ChatService } from 'src/app/Shared/Chat/chat.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';
import { ChatSettingService } from 'src/app/Shared/Home/chat-setting.service';
import { alertSetting } from '../alert/alert';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  HubConnectionOnline: HubConnection;
  constructor(private dialog: MatDialog, public _ChatSettingService: ChatSettingService, private router: Router, private _HomeService: HomeService, private _ProfileService: ProfileService, private _ChatsService: ChatService) {
  }
  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.ChangeCommentNew();
    });
    this.ChangeCommentNew();
    this.Shared();
    this._ChatsService.GetAllChats().subscribe(res => {
      this.AllChats = res;
    });
    this.SetOnlineHub();
  }

  IsShowCommentNew: boolean;
  MenuIcon = 'arrow_back';
  UserID = localStorage.getItem('UserID');
  AllChats: AllChats[] = new Array<AllChats>();
  ListOnlineUser: string[] = [];
  SelectIndexSetting: number;
  SetOnlineHub() {
    this.HubConnectionOnline = new HubConnectionBuilder().withAutomaticReconnect().withUrl(environment.AddressServer + '/OnlineHub?UserID=' + this.UserID).build();
    this.HubConnectionOnline.on('ReceiveOnlineConnect', (userID: string) => {
      this._ChatsService.ShareAddOnlineUser.next(userID);
      this.HubConnectionOnline.invoke('ReConnectUser', this.UserID);
      if (!this.ListOnlineUser.find(s => s == userID))
        this.ListOnlineUser.push(userID);
    });
    this.HubConnectionOnline.on('ReceiveOnlineDisconnect', (userID: string) => {
      this._ChatsService.ShareDeleteOnlineUser.next(userID);
    });
    this.HubConnectionOnline.on('ReceiveAddOnline', (userID: string) => {
      this._ChatsService.ShareAddOnlineUser.next(userID);
      if (!this.ListOnlineUser.find(s => s == userID))
        this.ListOnlineUser.push(userID);
    });
    this.HubConnectionOnline.on('ReceiveAddNotSeen', (chatID: string, userID: string) => {
      if (this.UserID != userID)
        this.AllChats.find(s => s.chatID == chatID).countNoSee += 1;
    });
    this.HubConnectionOnline.on('ReceiveDeleteNotSeen', (chatID: string) => {
      if (this.AllChats.find(s => s.chatID == chatID).countNoSee > 0)
        this.AllChats.find(s => s.chatID == chatID).countNoSee -= 1;
    });
    this.HubConnectionOnline.on('ReceiveAddChat', (chat: AllChats) => {
      if (!this.AllChats.find(s => s == chat)) {
        this.AllChats.push(chat);
        this.HubConnectionOnline.invoke('AddToGroups', this.UserID);
      }
    });
    this.HubConnectionOnline.on('ReceiveDeleteChat', (ChatId: string) => {
      if (this.AllChats.find(s => s.chatID == ChatId)) {
        let index = this.AllChats.findIndex(s => s.chatID == ChatId);
        this.AllChats.splice(index, 1);
        this.router.navigate(['/User']);
      }
    });
    this.HubConnectionOnline.on('ReceiveAddUserToGroup', (chat: AllChats) => {
      if (!this.AllChats.find(s => s == chat))
        this.AllChats.push(chat);
      this.HubConnectionOnline.invoke('AddToGroups', this.UserID);
    });
    this.HubConnectionOnline.on('ReceiveEditNameGroup', (nameGroup: NameGroup) => {
      if (this.AllChats.find(s => s.chatID == nameGroup.chatID)) {
        this.AllChats.find(s => s.chatID == nameGroup.chatID).title = nameGroup.title;
      }
    });
    this.HubConnectionOnline.start();
  }
  ChangeCommentNew() {
    if (this.router.url === "/User") {
      this.IsShowCommentNew = true;
    } else {
      this.IsShowCommentNew = false;
    }
  }
  SelectSetting(index: number) {
    if (this.SelectIndexSetting == index)
      this.SelectIndexSetting = null;
    else
      this.SelectIndexSetting = index;
  }
  Shared() {
    this._ChatsService.ShareAddNotSeen.subscribe(commentID => {
      if (commentID != null && commentID != "")
        this.HubConnectionOnline.invoke('AddNotSeen', commentID);
    });
    this._ChatsService.ShareDeleteNotSeen.subscribe(res => {
      if (res != null && res != "")
        this.HubConnectionOnline.invoke('DeleteNotSeen', res);
    });
    this._HomeService.ShareAddChat.subscribe((res: any) => {
      if (res === true)
        this.StartAlert(new alertSetting('bg-43aa8b', 'چنین گفتگویی وجود دارد', true, 0));
      else if (res != null)
        this.HubConnectionOnline.invoke('AddChat', res.chatID);
    });
    this._ChatSettingService.ShareDeleteChat.subscribe(chatId => {
      if (chatId !== null && chatId != "")
        this.HubConnectionOnline.invoke('DeleteChat', chatId);
    });
    this._ChatSettingService.ShareResetSelectIndexSettingHome.subscribe(res => {
      if (res === true)
        this.SelectIndexSetting = null;
    });
    this._ChatSettingService.ShareAddUserToGroup.subscribe((listUserId: string[]) => {
        this.HubConnectionOnline.invoke('AddUserToGroup', listUserId);
    });
    this._ChatSettingService.ShareExitGroup.subscribe((chatID: string) => {
      if (this.AllChats.find(s => s.chatID == chatID)) {
        let index = this.AllChats.findIndex(s => s.chatID == chatID);
        this.AllChats.splice(index, 1);
        this.router.navigate(['/User']);
      }
    });
    this._ChatSettingService.ShareEditNameGroup.subscribe((nameGroup: NameGroup) => {
      if (nameGroup != null)
        this.HubConnectionOnline.invoke('EditNameGroup', nameGroup);
    });
  }
  OnActivate(componentReference) {
    try {
      componentReference.SetOnlineUser(this.ListOnlineUser);
    } catch { }
  }
  ChageOpenMenu(state: string) {
    if (state === 'opened') {
      this.MenuIcon = 'arrow_back';
    }
    if (state === 'closed') {
      this.MenuIcon = 'arrow_forward';
    }
  }
  OpenCommentNew() {
    this.dialog.open(CommentNewComponent);
  }
  public LogOut() {
    localStorage.clear(); 
    this.HubConnectionOnline.stop();     
    this.router.navigate(["/Account/Login"]).then(()=>{
      window.location.reload();
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
  CompreesChatTitle(title: string) {
    return title.substring(0, 1);
  }  
  
}