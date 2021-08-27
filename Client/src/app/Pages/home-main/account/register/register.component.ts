import { Router } from '@angular/router';
import { AccountService } from '../../../../Shared/Account/account.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { IRegister } from 'src/app/Shared/Account/account';
import { alertSetting } from '../../../alert/alert';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _AccountService: AccountService, private router: Router,private titleService:Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("Chaty | ثبت نام در سایت")
  }
  ShowPassword: boolean = false;
  ShowRePassword: boolean = false;

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
    ]),
    repassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(150)
    ])
  }, { validators: this.Validator });
  Validator(form: FormGroup): ValidatorFn {
    const password = form.get('password').value;
    const repassword = form.get('repassword').value;
    let mobile = form.get('mobile').value;
    if (password !== repassword) {
      form.get('repassword').setErrors({ "NotMatch": true });
    }
    if (mobile / 1 === NaN) {
      form.get('mobile').setErrors({ "Fotmat": true });
    }
    return;
  }


  GetErrorForm(prop: string) {
    if (this.formGroup.invalid) {
      if (this.formGroup.get('mobile').invalid && prop === 'mobile') {
        if (this.formGroup.get("mobile").hasError('ExistError')) {
          return 'شماره موبایل وارد شده تکرار می باشد';
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
      if (this.formGroup.get('repassword').invalid && prop === 'repassword') {
        if (this.formGroup.get('repassword').hasError("NotMatch").valueOf) {
          return 'رمز های عبور با یکدیگر مغایرت دارند';
        }
        if (this.formGroup.get('repassword').hasError('required')) {
          return "لطفا تکرار رمز عبور خود را وارد نمایید";
        }
        if (this.formGroup.get('repassword').hasError('minLength').valueOf) {
          return "لطفا تکرار رمز عبور را بیشتر از 6 کاراکتر وارد نمایید";
        }
        if (this.formGroup.get('repassword').hasError('maxLength').valueOf) {
          return "لطفا تکرار رمز عبور را کمتر از 150 کاراکتر وارد نمایید";
        }
      }
    }
  }
  model: IRegister = new IRegister();
  IsAlert: boolean = false;
  AlertData: alertSetting;
  OnSubmit(form: NgForm) {
    this._AccountService.AddUser(form.value).subscribe(res => {
      if (res === 400) {
        this.formGroup.get('mobile').setErrors({ "ExistError": true });
      }
      if (res === 200) {
        this.StartAlert(new alertSetting('bg-green', 'شما با موفقیت در سایت ثبت نام شدید', true, 0));
      }
    });
  }
  StartAlert(setting: alertSetting) {
    if (this.IsAlert == false) {
      this.AlertData = setting;
      this.IsAlert = true;
    }
  }
  CloseAlert() {
    this.IsAlert = false;
    this.router.navigate(["/Account/Login"]);
  }

  ShowErrorMobile: boolean = false;
  ShowErrorPassword: boolean = false;
  ShowErrorRePassword: boolean = false;
  ChangeShowErrorMobile() {
    if (this.ShowErrorMobile === false)
      this.ShowErrorMobile = true;
  }
  ChangeShowErrorPassword() {
    if (this.ShowErrorPassword === false)
      this.ShowErrorPassword = true;
  }
  ChangeShowErrorRePassword() {
    if (this.ShowErrorRePassword === false)
      this.ShowErrorRePassword = true;
  }
}
