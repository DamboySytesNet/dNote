import { INote } from './INote';

export interface ILeftNotes {
    /**
     * Currently selected note
     */
    curr: INote;

    /**
     * Checks if there are any categories,
     * to display appropriate message.
     */
    checkState(): void;

    /**
     * Add note element at the end
     * @param note note html element to be inserted
     */
    add(note: HTMLDivElement): void;

    /**
     * Add note element in appropriate place
     */
    addBefore(
        noteElement: HTMLDivElement,
        referencedElement: HTMLDivElement
    ): void;

    /**
     * Change the position of note to match sorted order
     * @param note note to be moved
     */
    move(note: INote): void;

    /**
     * Clear notes and rebuild them
     */
    rebuild(): void;

    /**
     * Removes notes from tab
     */
    clear(): void;
}
