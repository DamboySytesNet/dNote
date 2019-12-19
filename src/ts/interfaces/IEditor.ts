import { IContentOptions } from './IContentOptions';
import { IEditorMode } from './IEditorMode';
import { INote } from './INote';

export interface IEditor {
    currentNote: INote;
    /**
     * Availible modes:
     * empty
     * new
     * edit
     * view
     */
    mode: string;

    /** */
    chosenColors: string[];
    chosenColorsCallbacks: any[];

    words: number;
    chars: number;

    /**
     * Array of tags for new note
     */
    newTags: string[];

    cursorPos: Range;

    options: IContentOptions;

    init(): void;
    colorCustomColors(): void;

    setMode(mode: string): any;

    allowStateChange(): any;
    viewMode: IEditorMode;
    editMode: IEditorMode;
    newMode: IEditorMode;
    emptyMode: IEditorMode;

    saveNote(): void;
    createNote(): void;
    editNote(): void;

    saveSelection(): void;
    restoreSelection(): void;
    assignListeners(): void;
}
