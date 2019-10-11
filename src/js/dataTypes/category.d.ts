declare class Category {
    id: number;
    name: string;
    color: string;
    notes: Note[];
    leftHTML: HTMLDivElement;
    constructor(id: number, name: string, color: string, notes: Note[]);
    buildLeftHTML(): HTMLDivElement;
    choose(): void;
    unchoose(): void;
    update(name: string, color: string): void;
    sortNotes(notes: Note[]): Note[];
    addNotes(): void;
    promptRemoveNote(note: Note): void;
    removeNote(searchedNote: Note): void;
    prepRemove(): void;
}
