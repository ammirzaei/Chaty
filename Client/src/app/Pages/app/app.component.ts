import { LoaderService } from './../loader/loader.service';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Chaty';
  constructor(public _loaderService: LoaderService) { }
}
