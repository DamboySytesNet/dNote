interface IEditor {
    /**
     * 0 - view state
     * 1 - edit state
     * 2 - create state
     */
    state: number;
    currentNote: Note;
    chosenColors: string[];
    chosenColorsCallbacks: any[];
    words: number;
    chars: number;
    cursorPos: Range;
    options: IContentOptions;
    init(): void;
    checkState(): void;
    changeState(state: number): void;
    open(newNote?: boolean): void;
    reset(): void;
    colorCustomColors(): void;
    displayNote(): void;
    editNote(): void;
    newNote(): void;
    saveNote(): void;
    saveSelection(): void;
    restoreSelection(): void;
    assignListeners(): void;
}
interface IContentOptions {
    shown: boolean;
    toggle(state?: boolean): void;
    addTag(): void;
    removeTag(tagName: string): void;
}
declare const Editor: IEditor;
