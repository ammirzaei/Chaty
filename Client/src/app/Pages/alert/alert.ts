export class alertSetting {
    alertClassColor: string;
    alertMessage: string;
    alertClose: boolean;
    alertDuration: number;
    constructor(classColor: string, message: string, close: boolean, duration: number) {
        this.alertClassColor = classColor;
        this.alertMessage = message;
        this.alertClose = close;
        this.alertDuration = duration;
    }
}