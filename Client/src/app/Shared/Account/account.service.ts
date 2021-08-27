import { IRegister } from './account';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  AddUser(register: IRegister) {
    return this.http.post(environment.AddressBase + "/Account/Register", register);
  }

  LoginUser(register: IRegister) {
    return this.http.post(environment.AddressBase + "/Account/Login", register);
  }
}
