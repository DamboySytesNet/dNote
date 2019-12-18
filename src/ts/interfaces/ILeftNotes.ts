import { Note } from '../dataTypes/Note';

export interface ILeftNotes {
    /**
     * Currently selected note
     */
    curr: Note;

    /**
     * Checks if there are any categories,
     * to display appropriate message.
     */
    checkState(): void;

    /**
     * Removes notes from tab
     */
    clear(): void;

    /**
     * Adds new note to the tab
     * @param obj - note to be added
     */
    add(obj: HTMLDivElement): void;
}
