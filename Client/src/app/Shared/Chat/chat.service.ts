import { catchError } from 'rxjs/operators';
import { AllChats, AllComments, AddComment, EditComment } from './Chats';
import { environment } from './../../../environments/environment';
import { throwError, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient, private router: Router) { }

  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  Error(error: HttpErrorResponse) {
    if (error.status === 401) {
      localStorage.clear();
      this.router.navigate(['/Account/Login']);
    }
    return throwError('لطفا دوباره تلاش کنید');
  }

  GetAllChats() {
    return this.http.get<AllChats[]>(environment.AddressBase + "/Chats/GetAllChats", { headers: this.header }).pipe(catchError(this.Error));
  }

  GetAllComments(chatID: string) {
    return this.http.get<AllComments[]>(environment.AddressBase + "/Chats/GetAllComments/" + chatID, { headers: this.header }).pipe(catchError(this.Error));
  }

  AddComment(message: AddComment) {
    return this.http.post(environment.AddressBase + `/Chats/AddComment`, message, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  DeleteComment(commentID: string) {
    return this.http.delete(environment.AddressBase + "/Chats/DeleteComment/" + commentID, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  EditComment(editComment:EditComment) {
    return this.http.put(environment.AddressBase + `/Chats/EditComment`, editComment, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  ShareAddNotSeen = new Subject<string>();
  ShareDeleteNotSeen = new Subject<string>();
  ShareAddOnlineUser = new Subject<string>();
  ShareDeleteOnlineUser = new Subject<string>();
}
