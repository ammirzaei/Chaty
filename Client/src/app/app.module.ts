import { ChatSettingService } from './Shared/Home/chat-setting.service';
import { InterceptorService } from './Pages/loader/interceptor.service';
import { ChatService } from './Shared/Chat/chat.service';
import { ProfileService } from './Shared/Profile/profile.service';

import { AccountService } from './Shared/Account/account.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './Pages/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HomeComponent } from './Pages/home/home.component';
import { CommentNewComponent } from './Pages/comment-new/comment-new.component';
import { ChatComponent } from './Pages/chat/chat.component';
import { RegisterComponent } from './Pages/home-main/account/register/register.component';
import { AccountComponent } from './Pages/home-main/account/account.component';
import { LoginComponent } from './Pages/home-main/account/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeService } from './Shared/Home/home.service';
import { ProfileComponent } from './Pages/profile/profile.component';
import { EditProfileComponent } from './Pages/edit-profile/edit-profile.component';
import { AlertComponent } from './Pages/alert/alert.component';
import { DeleteHistoryComponent } from './Pages/chat-setting/delete-history/delete-history.component';
import { DeleteChatComponent } from './Pages/chat-setting/delete-chat/delete-chat.component';
import { AddUserComponent } from './Pages/chat-setting/add-user/add-user.component';
import { ExitGroupComponent } from './Pages/chat-setting/exit-group/exit-group.component';
import { EditnameGroupComponent } from './Pages/chat-setting/editname-group/editname-group.component';
import { ProfileUserComponent } from './Pages/chat-setting/profile-user/profile-user.component';
import { ProfileGroupComponent } from './Pages/chat-setting/profile-group/profile-group.component';
import { HomeMainComponent } from './Pages/home-main/home-main.component';
import { HomeContentComponent } from './Pages/home-main/home-content/home-content.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CommentNewComponent,
    ChatComponent,
    RegisterComponent,
    AccountComponent,
    LoginComponent,
    ProfileComponent,
    EditProfileComponent,
    AlertComponent,
    DeleteHistoryComponent,
    DeleteChatComponent,
    AddUserComponent,
    ExitGroupComponent,
    EditnameGroupComponent,
    ProfileUserComponent,
    ProfileGroupComponent,
    HomeMainComponent,
    HomeContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [AccountService, HomeService, ProfileService, ChatService,ChatSettingService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
