import { AllChats } from './../Chat/Chats';
import { environment } from './../../../environments/environment';
import { Profile, ProfileInfo } from './home';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
  }
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

  GetResultSearchMobile(mobile: string) {
    return this.http.get<ProfileInfo[]>(environment.AddressBase + `/Home/SearchMobile/${mobile}`, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  StartContact(userID: string[]) {
    return this.http.post(environment.AddressBase + `/Home/StartContact`, userID, { headers: this.header, observe: 'response' }).pipe(catchError(this.Error));
  }
  ShareAddChat = new Subject<any>();
}
