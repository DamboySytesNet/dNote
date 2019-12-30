import { INote } from './INote';

export interface INoteInfo {
    /** Is initialized */
    initialized: boolean;
    /** Is shown */
    shown: boolean;
    /** Permission to close dialog */
    allowClose: boolean;

    /** Initialize dialog */
    init(): void;

    /**
     * Open dialog
     * @param el note on which info will be based
     */
    open(el: INote): void;

    /**
     * Fill the info based on note
     * @param el note on which info is based
     */
    fill(el: INote): void;

    /** Key handler */
    keyHandler(ev: KeyboardEvent): void;

    /** Check if allowed to close */
    checkClose(): void;

    /** Clear content */
    clear(): void;

    /** Close dialog */
    close(): void;
}
