export interface IConfirm {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;
    confirmed: boolean;
    cancelCallback: any;

    init(): void;
    open(
        title: string,
        text: string,
        buttonText: string,
        callback: any,
        cancelCallback?: any
    ): void;
    keyHandler(ev: KeyboardEvent): void;
    checkClose(): void;
    close(): void;
}
