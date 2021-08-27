import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.css']
})
export class HomeMainComponent implements OnInit {

  constructor(private titleService: Title, private routerService: Router) {

  }

  ngOnInit(): void {
    this.SetTitlePage();
  }
  SetTitlePage() {
    this.titleService.setTitle('Chaty | صفحه اصلی');
  }
  GotoHome() {
    this.SetTitlePage();
    this.routerService.navigate(["/"]);
  }
}
