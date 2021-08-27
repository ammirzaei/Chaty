import { HomeContentComponent } from './Pages/home-main/home-content/home-content.component';
import { HomeMainComponent } from './Pages/home-main/home-main.component';
import { ProfileGroupComponent } from './Pages/chat-setting/profile-group/profile-group.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { RegisterComponent } from './Pages/home-main/account/register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { ChatComponent } from './Pages/chat/chat.component';
import { AccountComponent } from './Pages/home-main/account/account.component';
import { LoginComponent } from './Pages/home-main/account/login/login.component';
import { AuthGuard } from './Pages/Auth/auth.guard';
import { ProfileUserComponent } from './Pages/chat-setting/profile-user/profile-user.component';

const routes: Routes = [
  {
    path: '', component: HomeMainComponent, children: [
      { path: '', component: HomeContentComponent },
      {
        path: 'Account', component: AccountComponent, children: [
          { path: 'Register', component: RegisterComponent },
          { path: 'Login', component: LoginComponent }
        ]
      },
    ]
  },
  { path: 'Home', redirectTo: '' },
  {
    path: 'User', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: '', component: ProfileComponent },
      { path: 'Chat/:id/:title', component: ChatComponent },
      { path: 'Profile/User/:id', component: ProfileUserComponent },
      { path: 'Profile/Group/:id', component: ProfileGroupComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
