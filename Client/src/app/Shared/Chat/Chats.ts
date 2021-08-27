export class AllChats {
    chatID: string;
    title: string;
    image: string;
    countNoSee: number;
    method: string;
}
export interface AllComments {
    chatID: string;
    commentID: string;
    userID: string;
    name: string;
    imageName: string;
    message: string;
    createDate: string;
    isSee: boolean;
}
export class ListTyping {
    userId: string;
    name: string;
    imageName: string;
    chatId: string;
    constructor(userID: string, name: string, imageName: string, chatID: string) {
        this.userId = userID;
        this.name = name;
        this.imageName = imageName;
        this.chatId = chatID;
    }
}
export class ListMessageChat {
    chatID: string;
    message: string;
    constructor(ChatID: string, Message: string) {
        this.chatID = ChatID;
        this.message = Message;
    }
}
export class UserOnline {
    chatID: string;
    userID: string;
    isActive: boolean;
    constructor(ChatID: string, UserID: string, IsActive: boolean) {
        this.chatID = ChatID;
        this.userID = UserID;
        this.isActive = IsActive;
    }
}
export class AddComment{
    chatID: string;
    message: string;
    constructor(ChatID: string, Message: string) {
        this.chatID = ChatID;
        this.message = Message;
    }
}
export class EditComment{
    commentID: string;
    message: string;
    constructor(commentID: string, Message: string) {
        this.commentID = commentID;
        this.message = Message;
    }
}