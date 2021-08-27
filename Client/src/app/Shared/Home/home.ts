export class ProfileInfo {
    name: string;
    imageName: string;
    userID: string;
}
export class Profile {
    userID: string;
    name: string;
    imageName: string;
    bio: string;
    mobile: string; 
    createDate: string;
}
export class NameGroup {
    chatID: string;
    title: string;
    constructor(ChatID: string, Title: string) {
        this.chatID = ChatID;
        this.title = Title;
    }
}
export class ProfileGroup {
    name: string;
    imageName: string;
    bio: string;
    createDate: string;
    listUsers: ListUserInProfileGroup[];
    createUser: ListUserInProfileGroup;
}
export interface ListUserInProfileGroup {
    name: string;
    userID: string;
}