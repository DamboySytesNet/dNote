interface IAlert {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;
    init(): void;
    open(title: string, text: string): void;
    keyHandler(ev: KeyboardEvent): void;
    checkClose(): void;
    close(): void;
}
declare const Alert: IAlert;
