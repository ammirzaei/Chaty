import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public load = new Subject<boolean>();
  IsLoading: Observable<boolean> = this.load.pipe(delay(0));
  constructor() { }
}
