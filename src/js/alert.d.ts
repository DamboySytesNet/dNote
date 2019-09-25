interface IAlert {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;
    init(): void;
    open(title: string, text: string, buttonText: string, callback: any): void;
    keyHandler(ev: KeyboardEvent): void;
    checkClose(): void;
    clear(): void;
    close(): void;
}
declare const Alert: IAlert;
