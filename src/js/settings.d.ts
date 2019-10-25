interface ISettings {
    open(): void;
    keyHandler(ev: KeyboardEvent): void;
    assignListeners(): void;
    close(): void;
}
declare const Settings: ISettings;
