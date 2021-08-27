import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../loader/loader.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private router: Router,private _LoaderService:LoaderService) { }

  ngOnInit(): void {   
    if (localStorage.getItem('token') != null) {
      this.router.navigate(["/User"]);
    }
    this.router.navigate(["/Account/Login"]);
    this._LoaderService.load.next(false);
  }
}
