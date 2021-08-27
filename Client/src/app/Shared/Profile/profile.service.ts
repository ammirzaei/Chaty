import { catchError } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { Profile, ProfileInfo } from './../Home/home';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient, private router: Router) {
  }

  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  Error(error: HttpErrorResponse) {
    if (error.status === 401) {
      localStorage.removeItem('token');
      this.router.navigate(['/Account/Login']);
    }
    return throwError('لطفا دوباره تلاش کنید');
  }

  GetProfileInfo() {
    return this.http.get<ProfileInfo>(environment.AddressBase + '/Profile/Info', { headers: this.header }).pipe(catchError(this.Error));
  }

  ShareProfileInfoName = new Subject<any>();

  GetProfile() {
    {
      return this.http.get<Profile>(environment.AddressBase + '/Profile', { headers: this.header }).pipe(catchError(this.Error));
    }
  }
  ShareProfileName = new Subject<any>();
  ShareProfileBio = new Subject<any>();

  EditProfileName(name: string) {
    return this.http.post(environment.AddressBase + '/Profile/EditName/' + name, null, { headers: this.header }).pipe(catchError(this.Error));
  }
  EditProfileBio(bio: string) {
    return this.http.post(environment.AddressBase + "/Profile/EditBio/" + bio, null, { headers: this.header }).pipe(catchError(this.Error));
  }

  EditProfileAvatar(file: any) {
    const header = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(environment.AddressBase + "/Profile/EditImage", file, { reportProgress: true, headers: header, observe: 'response' }).pipe(catchError(this.Error));
  }
  ShareProfileAvatar = new Subject<any>();

}
