interface ISettings {
    initialized: boolean;
    section: string;
    queue: boolean;
    options: any;
    init(): void;
    open(): void;
    choose(section: string): void;
    unchoose(): void;
    keyHandler(ev: KeyboardEvent): void;
    assignListeners(): void;
    close(): void;
}
declare const Settings: ISettings;
