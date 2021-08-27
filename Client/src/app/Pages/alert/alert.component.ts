import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { alertSetting } from './alert';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements AfterViewInit {

  constructor() { }
  ngAfterViewInit(): void {
    this.AlertDuration = this.Data.alertDuration;
    this.SetSettingAlert();
  }
  @Input('ParentData') public Data: alertSetting;
  @Output() public ChildData = new EventEmitter();
  @ViewChild('alert') alert: ElementRef;
  ShowAlert: boolean = true;
  AlertDuration: number;

  SetSettingAlert() {
    if (this.Data.alertDuration != 0) {
      let alert = document.createElement('style');
      alert.innerHTML =
        `.alert::before {
        animation: alert-before-animation ${this.AlertDuration}ms forwards;
      }`;
      document.head.appendChild(alert);

      let timer = setInterval(() => {
        this.AlertDuration = this.AlertDuration - 1000;
        if (this.AlertDuration <= 0) {
          clearInterval(timer);
          this.SetCloseAlert();
        }
      }, 1000);
    }
  }
  SetCloseAlert() {
    this.ChildData.emit();
  }
}
