interface IContent {
    initialized: boolean;
    editing: boolean;
    creating: boolean;
    chosenColors: string[];
    chosenColorsCallbacks: any[];
    cursorPos: Range;
    options: IContentOptions;
    init(): void;
    changeState(state?: boolean): void;
    colorCustomColors(): void;
    saveSelection(): void;
    restoreSelection(): void;
    check(): void;
    unselect(): void;
    create(): void;
    assignListeners(): void;
}
interface IContentOptions {
    shown: boolean;
    toggle(state?: boolean): void;
    addTag(): void;
    removeTag(tagName: string): void;
}
declare const Content: IContent;
