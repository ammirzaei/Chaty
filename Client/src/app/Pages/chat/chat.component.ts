import { LoaderService } from './../loader/loader.service';
import { AddComment, AllComments, ListMessageChat, ListTyping, EditComment } from './../../Shared/Chat/Chats';
import { ChatService } from 'src/app/Shared/Chat/chat.service';
import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from './../../../environments/environment';
import { alertSetting } from '../alert/alert';
import { filter } from 'rxjs/operators';
import { ChatSettingService } from 'src/app/Shared/Home/chat-setting.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewInit, OnInit {
  ChatID: string;
  ChatTitle: any;
  ChatIDBebore: string = null;
  HubConnectionTyping: HubConnection;
  HubConnectionMessage: HubConnection;
  @ViewChild('message') Inputmessage: ElementRef;
  constructor(private route: ActivatedRoute,private _LoaderService:LoaderService ,private _ChatSettingService: ChatSettingService, private router: Router, private _ChatService: ChatService) {
  } 
  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      this.ChatID = p.get('id');
      this.ChatTitle = p.get('title');
      if (this.ChatID != null) {
        this._ChatService.GetAllComments(this.ChatID).subscribe(res => {
          this.AllComments = res
        });
      };
      this.SetAllConnection();
    });
    this.SetOnlineUser(null);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((res: NavigationEnd) => {
      if (!res.url.includes('/Chat/'))
        this.ChatID = null;
    });
    this.ShareChatSetting();
  }
  @ViewChild('scrollMe') private scroll: ElementRef;
  ngAfterViewInit(): void {
    this.route.paramMap.subscribe(p => {
      this.SetToListMessage();
      this.ChatIDBebore = p.get('id');
    });
  }
  UserID: string = localStorage.getItem('UserID');
  AllComments: AllComments[] = [];
  ListTyping: ListTyping[] = [];
  ListMessageChat: ListMessageChat[] = [];
  InputMessageFocus: boolean = false;
  IsAlert: boolean = false;
  AlertData: alertSetting;
  ListOnline: string[] = [];
  SetAllConnection() {
    this.SetMessageHub();
    this.SetTypingHub();
  }
  SetTypingHub() {
    this.HubConnectionTyping = new HubConnectionBuilder().withAutomaticReconnect().withUrl(environment.AddressServer + "/TypeHub?ChatID=" + this.ChatID).build();
    this.HubConnectionTyping.on("ReceiveAddTyping", (userId: string, name: string, imageName: string, chatId: string) => {
      if (this.UserID != userId) {
        let type: ListTyping = new ListTyping(userId, name, imageName, chatId);
        if (!this.ListTyping.find(s => s.userId == userId)) {
          this.ListTyping.push(type);
        }
      }
    });
    this.HubConnectionTyping.on('ReceiveDeleteTyping', (userId: string, chatId: string) => {
      if (this.ListTyping.find(s => s.userId == userId && s.chatId == chatId)) {
        let index = this.ListTyping.findIndex(s => s.userId == userId && s.chatId == chatId);
        this.ListTyping.splice(index, 1);
      }
    });
    this.HubConnectionTyping.start();
    this.HubConnectionTyping.onclose(() => {
      setTimeout(() => {
        this.HubConnectionTyping.start();
      }, 5000)
    });
  }
  SetMessageHub() {
    this.HubConnectionMessage = new HubConnectionBuilder().withAutomaticReconnect().withUrl(environment.AddressServer + '/MessageHub?ChatID=' + this.ChatID).build();
    this.HubConnectionMessage.on("ReceiveSendMessage", (Comment: AllComments) => {
      if (!this.AllComments.find(s => s.commentID == Comment.commentID) && Comment.chatID == this.ChatID) {
        this.AllComments.push(Comment);
        if (Comment.userID != this.UserID && Comment.chatID == this.ChatID)
          this.HubConnectionMessage.invoke('SeenMessage', Comment.commentID);
        else
          this._ChatService.ShareAddNotSeen.next(Comment.commentID);
      }
    });
    this.HubConnectionMessage.on("ReceiveDeleteMessage", (CommentID: string) => {
      if (this.AllComments.find(s => s.commentID == CommentID)) {
        let index = this.AllComments.findIndex(s => s.commentID == CommentID);
        if (this.AllComments[index].isSee === false) {
          this._ChatService.ShareDeleteNotSeen.next(this.AllComments[index].chatID);
        }
        this.AllComments.splice(index, 1);
      }
    });
    this.HubConnectionMessage.on('ReceiveEditMessage', (CommentID: string, Message: string) => {
      if (this.AllComments.find(s => s.commentID == CommentID)) {
        this.AllComments.find(s => s.commentID == CommentID).message = Message;
      }
    });
    this.HubConnectionMessage.on('ReceiveSeen', (CommentID: string) => {
      if (this.AllComments.find(s => s.commentID == CommentID && s.isSee == false)) {
        this.AllComments.find(s => s.commentID == CommentID).isSee = true;
        this._ChatService.ShareDeleteNotSeen.next(this.AllComments.find(s => s.commentID == CommentID).chatID);
      }
    });
    this.HubConnectionMessage.on("ReceiveAllSeen", (UserId: string) => {
      for (let item of this.AllComments.filter(s => s.isSee == false && s.userID != UserId && s.userID == this.UserID)) {
        this.AllComments.find(s => s.commentID == item.commentID).isSee = true;
        if (item.chatID == this.ChatID)
          this._ChatService.ShareDeleteNotSeen.next(item.chatID);
      }
    });
    this.HubConnectionMessage.on('ReceiveDeleteHistory', (userID: string, chatID: string) => {
      for (let item of this.AllComments.filter(s => s.userID == userID && s.chatID == chatID)) {
        let index = this.AllComments.findIndex(s => s.commentID == item.commentID);
        this.AllComments.splice(index, 1);
        this._ChatService.ShareDeleteNotSeen.next(item.chatID);
      }
    });
    this.HubConnectionMessage.start().then(() => {
      this.HubConnectionMessage.invoke('SeenAllMessage', this.UserID);
    });
    this.HubConnectionMessage.onclose(() => {
      setTimeout(() => {
        this.HubConnectionMessage.start().then(() => {
          this.HubConnectionMessage.invoke('SeenAllMessage', this.UserID);
        });
      }, 5000)
    })
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
  ManageInputMessageFocus() {
    this.InputMessageFocus = !this.InputMessageFocus;
    this.Typing(null);
  }
  Typing(event: any) {
    if (this.Inputmessage.nativeElement.value != "" && this.InputMessageFocus) {
      this.HubConnectionTyping.invoke('AddTyping', this.UserID);
    } else {
      this.HubConnectionTyping.invoke('DeleteTyping', this.UserID);
    }
    // if (event.keyCode === 13) { this.CommandComment(); }
  }
  ShareChatSetting() {
    this._ChatSettingService.ShareDeleteHistory.subscribe(res => {
      if (res !== null && res != '')
        this.HubConnectionMessage.invoke('DeleteHistory', res);
    });
  }
  SetToListMessage() {
    let MessageChat: ListMessageChat;
    if (this.ChatIDBebore === null) {
      if (this.ListMessageChat.find(s => s.chatID == this.ChatID)) {
        let index = this.ListMessageChat.findIndex(s => s.chatID == this.ChatID);
        this.ListMessageChat.splice(index, 1);
      }
      MessageChat = new ListMessageChat(this.ChatID, this.Inputmessage.nativeElement.value);
    } else {
      if (this.ListMessageChat.find(s => s.chatID == this.ChatIDBebore)) {
        let index = this.ListMessageChat.findIndex(s => s.chatID == this.ChatIDBebore);
        this.ListMessageChat.splice(index, 1);
      }
      MessageChat = new ListMessageChat(this.ChatIDBebore, this.Inputmessage.nativeElement.value);
      // this.HubConnectionTyping.invoke('DeleteTyping', this.UserID, this.ChatIDBebore);
    }
    this.ListMessageChat.push(MessageChat);

    if (this.ListMessageChat.find(s => s.chatID == this.ChatID)) {
      let message = this.ListMessageChat.find(s => s.chatID == this.ChatID).message;
      this.Inputmessage.nativeElement.value = message;
    } else {
      this.Inputmessage.nativeElement.value = null;
    }
  }
  ShowAvatar(index: number): boolean {
    let countIndex = this.AllComments.length - 1;
    if (countIndex !== index) {
      let indexNext = index + 1;
      let commentNext = this.AllComments[indexNext];
      let comment = this.AllComments[index];

      if (comment.imageName === commentNext.imageName) {
        return false;
      }
      return true;
    }
    return true;
  }
  CheckOnlineUser(userID: string): string {
    if (this.ListOnline.find(s => s == userID))
      return 'online';
    else
      return 'offline';
  }
  CommandComment() {
    let message = this.Inputmessage.nativeElement.value.trim();
    if (message !== "" && message !== null) {
      if (this.CommentID === null) {
        const sendMessage: AddComment = new AddComment(this.ChatID, message);
        this._ChatService.AddComment(sendMessage).subscribe(res => {
          if (res.status === 200) {
            this.Inputmessage.nativeElement.value = null;
            let commentID = res.body['commentID'];
            this.HubConnectionMessage.invoke('SendMessage', commentID);
            this.CommentID = null;
          }
          if (res.status === 204) {
            this.Inputmessage.nativeElement.value = null;
            this.StartAlert(new alertSetting('bg-red', 'شما قادر به افزودن پیام نمی باشید', true, 0));
          }
        }, err => {
          this.StartAlert(new alertSetting('bg-red', 'خطایی رخ داد', true, 4000));
        })
      } else {
        const editMessage: EditComment = new EditComment(this.CommentID, message);
        this._ChatService.EditComment(editMessage).subscribe(res => {
          if (res.status === 200) {
            this.Inputmessage.nativeElement.value = null;
            this.HubConnectionMessage.invoke('EditMessage', this.CommentID);
            this.CommentID = null;
          }
          if (res.status === 402) {
            this.StartAlert(new alertSetting('bg-red', 'شما قادر به ویرایش این پیام نمی باشید', true, 0));
          }
        }, err => {
          this.StartAlert(new alertSetting('bg-red', 'خطایی رخ داد', true, 4000));
        });
      }
      this.HubConnectionTyping.invoke('DeleteTyping', this.UserID);
      this.Inputmessage.nativeElement.style.height = "65px";
      this._LoaderService.load.next(false);
    } else {
      this.StartAlert(new alertSetting('bg-yellow', 'لطفا پیام خود را وارد کنید', true, 4000));
    }
  } 
  DeleteComment(commentID: string) {
    if (commentID != null) {
      this._ChatService.DeleteComment(commentID).subscribe(res => {
        if (res.status === 200) {
          this.HubConnectionMessage.invoke('DeleteMessage', commentID);
          this.StartAlert(new alertSetting('bg-green', 'پیام شما با موفقیت حذف شد', true, 2000));
          this.CommentID = null;
        }
        if (res.status === 204) {
          this.StartAlert(new alertSetting('bg-red', 'شما فقط قادر به حذف پیام خود می باشید', true, 0));
        }
      }, err => {
      });
      this._LoaderService.load.next(false);
    }
  }
  CommentID: string = null;
  EditComment(commentID: string, message: string) {
    if (commentID != null && message != null) {
      this.Inputmessage.nativeElement.value = message;
      this.CommentID = commentID;
    }
  }
  StartAlert(setting: alertSetting) {
    if (this.IsAlert == false) {
      this.AlertData = setting;
      this.IsAlert = true;
    }
  }
  CloseAlert() {
    this.IsAlert = false;
  }
  CompressNameUser(name: string) {
    return name.substring(0, 1);
  }
}