import { INote } from './INote';

export interface ICategory {
    id: number;
    name: string;
    color: string;
    notes: INote[];
    leftHTML: HTMLDivElement;

    buildLeftHTML(): HTMLDivElement;

    choose(): void;

    unchoose(): void;

    update(name: string, color: string): void;

    sortNotes(notes: INote[]): INote[];

    rebuildNotes(): void;

    checkNotesDisplay(): void;

    appendNotes(): void;

    addNote(newNote: INote): void;

    checkState(): void;

    promptRemoveNote(note: INote): void;

    removeNote(searchedNote: INote): void;

    prepRemove(): void;
};
