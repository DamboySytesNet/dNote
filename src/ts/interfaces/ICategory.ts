import { INote } from './INote';

export interface ICategory {
    /**
     * Category id
     */
    id: number;
    /**
     * Category name
     */
    name: string;
    /**
     * Category color
     */
    color: string;
    /**
     * Notes that are assigned to this category
     */
    notes: INote[];
    /**
     * HTML left element
     */
    leftHTML: HTMLDivElement;

    /**
     * Build HTML element for left tab
     */
    buildLeftHTML(): HTMLDivElement;

    /**
     * Choose category
     */
    choose(): void;

    /**
     * Unchoose category
     */
    unchoose(): void;

    /**
     * Change category
     */
    update(name: string, color: string): void;

    /**
     * Sort its notes
     */
    sortNotes(notes: INote[]): INote[];

    /**
     * Reappend notes to left bar
     */
    rebuildNotes(): void;

    /**
     * Trigger note display checking
     */
    checkNotesDisplay(): void;

    /**
     * Add note to category
     */
    addNote(newNote: INote): void;

    /**
     * Display additional info
     */
    checkState(): void;

    /**
     * Confirm that note should be removed
     */
    promptRemoveNote(note: INote): void;

    /**
     * Remove note
     */
    removeNote(searchedNote: INote): void;

    /**
     * Prepare before removal
     */
    prepRemove(): void;
};
