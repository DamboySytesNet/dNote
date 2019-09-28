interface IContent {
    initialized: boolean;
    editing: boolean;
    chosenColors: string[];
    chosenColorsCallbacks: any[];
    cursorPos: Range;
    tags: IContentTags;
    init(): void;
    changeState(state?: boolean): void;
    colorCustomColors(): void;
    saveSelection(): void;
    restoreSelection(): void;
    assignListeners(): void;
}
interface IContentTags {
    shown: boolean;
    toggle(state?: boolean): void;
}
declare const Content: IContent;
