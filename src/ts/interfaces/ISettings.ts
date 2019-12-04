import { ISettingsOptions } from './ISettingsOptions';

export interface ISettings {
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
};
