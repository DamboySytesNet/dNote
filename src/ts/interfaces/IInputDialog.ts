export interface IInputDialog {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;

    init(): void;
    open(
        title: string,
        text: string,
        inputText: string,
        buttonText: string,
        callback: any
    ): void;
    keyHandler(ev: KeyboardEvent): void;
    checkClose(): void;
    close(): void;
}
