interface INoteInfo {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;
    init(): void;
    open(el: INote): void;
    fill(el: INote): void;
    keyHandler(ev: KeyboardEvent): void;
    checkClose(): void;
    clear(): void;
    close(): void;
}
declare const NoteInfo: INoteInfo;
