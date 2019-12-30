import { IContentOptions } from './IContentOptions';
import { IEditorMode } from './IEditorMode';
import { INote } from './INote';

export interface IEditor {
    /** Currently edited note */
    currentNote: INote;

    /**
     * Availible modes:
     * empty
     * new
     * edit
     * view
     */
    mode: string;

    /** Custom colors picked */
    chosenColors: string[];

    /** Custom colors callbacks */
    chosenColorsCallbacks: any[];

    /** Amount of words */
    words: number;

    /** Amount of characters */
    chars: number;

    /**
     * Array of tags for new note
     */
    newTags: string[];

    /** Position of the cursor */
    cursorPos: Range;

    /** Options */
    options: IContentOptions;

    /** Initialize editor */
    init(): void;

    /** Coloring custom colors */
    colorCustomColors(): void;

    /**
     * Undo old mode and set new mode
     * @param mode mode to be applied
     */
    setMode(mode: string): any;

    /** Check if state can be changed and ask if necessary */
    allowStateChange(): any;

    /** Editor more: view note */

    viewMode: IEditorMode;
    /** Editor more: editing note */

    editMode: IEditorMode;
    /** Editor more: creating note */

    newMode: IEditorMode;
    /** Editor more: no note chosen */

    emptyMode: IEditorMode;

    /** Determine if saving means creating or editing */
    saveNote(): void;

    /** Create new note */
    createNote(): void;
    /** Edit note */
    editNote(): void;

    /** Save cursor selection */
    saveSelection(): void;
    /** Restore cursor selection */
    restoreSelection(): void;

    /** Assign listeners */
    assignListeners(): void;
}
