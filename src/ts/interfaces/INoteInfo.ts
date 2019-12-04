import { Note } from '../dataTypes/Note';

export interface INoteInfo {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;

    init(): void;
    open(el: Note): void;
    fill(el: Note): void;
    keyHandler(ev: KeyboardEvent): void;
    checkClose(): void;
    clear(): void;
    close(): void;
};
