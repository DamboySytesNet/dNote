import { IContentOptions } from './IContentOptions';

export interface IEditor {
    /**
     * 0 - view state
     * 1 - edit state
     * 2 - create state
     */
    state: number;
    /** Cache already rendered content (view mode) */
    editorViewed: boolean,
    /** Cache already rendered content (editing mode) */
    editorEdited: boolean,

    chosenColors: string[];
    chosenColorsCallbacks: any[];
    words: number;
    chars: number;

    newTags: string[];

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
};
