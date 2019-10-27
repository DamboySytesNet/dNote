interface ISettings {
    initialized: boolean;
    section: string;
    queue: boolean;
    options: ISettingsOptions;
    init(): void;
    open(): void;
    choose(section: string): void;
    unchoose(): void;
    keyHandler(ev: KeyboardEvent): void;
    assignListeners(): void;
    close(): void;
}
interface ISettingsOptions {
    general: ISettingsOptionsGeneral;
    appearance: any;
}
interface ISettingsOptionsGeneral {
    sortingOrder(no: number): void;
    sortingAsc(asd: boolean): void;
}
declare const Settings: ISettings;
