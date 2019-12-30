import { ISettingsOptions } from './ISettingsOptions';

export interface ISettings {
    /** Is initialized */
    initialized: boolean;
    /** Chosen section */
    section: string;
    /** Saving queue */
    queue: boolean;

    /** All options objects */
    options: ISettingsOptions;

    /** Initialize settings */
    init(): void;

    /** Open settings */
    open(): void;

    /**
     * Choose section
     * @param section section to be chosen
     */
    choose(section: string): void;

    /** Unchoose section */
    unchoose(): void;

    /** Key handler */
    keyHandler(ev: KeyboardEvent): void;
    /** Assign listeners */
    assignListeners(): void;
    /** Close settings */
    close(): void;
}
