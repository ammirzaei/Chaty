import { AccountService } from './../../../../Shared/Account/account.service';
import { IRegister } from 'src/app/Shared/Account/account';
import { FormGroup, FormControl, Validators, ValidatorFn, NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private _AccountService: AccountService, private router: Router, private titleService: Title) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.router.navigate(["/User"]);
    }
    this.titleService.setTitle('Chaty | ورود به سایت')
  }
  ShowPassword: boolean = false;
  formGroup = new FormGroup({
    mobile: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(150)
    ])
  });
  GetErrorForm(prop: string) {
    if (this.formGroup.invalid) {
      if (this.formGroup.get('mobile').invalid && prop === 'mobile') {
        if (this.formGroup.get('mobile').hasError('ExistMobile')) {
          return 'اطلاعات وارد شده اشتباه است';
        }
        if (this.formGroup.get('mobile').hasError('required')) {
          return "لطفا شماره موبایل خود را وارد نمایید";
        }
        if (this.formGroup.get('mobile').hasError('minLength').valueOf || this.formGroup.get('mobile').hasError('maxLength').valueOf || this.formGroup.get('mobile').hasError('Fotmat').valueOf) {
          return "لطفا شماره موبایل را صحیح وارد نمایید";
        }
      }
      if (this.formGroup.get('password').invalid && prop === 'password') {
        if (this.formGroup.get('password').hasError('required')) {
          return "لطفا رمز عبور خود را وارد نمایید";
        }
        if (this.formGroup.get('password').hasError('minLength').valueOf) {
          return "لطفا رمز عبور را بیشتر از 6 کاراکتر وارد نمایید";
        }
        if (this.formGroup.get('password').hasError('maxLength').valueOf) {
          return "لطفا رمز عبور را کمتر از 150 کاراکتر وارد نمایید";
        }
      }
    }
  }

  model: IRegister = new IRegister();
  OnSubmit(form: NgForm) {
    this._AccountService.LoginUser(form.value).subscribe(res => {
      if (res === 400) {
        this.formGroup.get("mobile").setErrors({ 'ExistMobile': true });
      }
      if (res.hasOwnProperty('token')) {
        localStorage.clear();
        let token = res['token'];
        localStorage.setItem('token', token);
        let userID = res["userID"];
        localStorage.setItem('UserID', userID);
        this.router.navigate(["/User"]);
      }
    });
  }

  ShowErrorMobile: boolean = false;
  ShowErrorPassword: boolean = false;
  ChangeShowErrorMobile() {
    if (this.ShowErrorMobile === false)
      this.ShowErrorMobile = true;
  }

  ChangeShowErrorPassword() {
    if (this.ShowErrorPassword === false)
      this.ShowErrorPassword = true;
  }
}
