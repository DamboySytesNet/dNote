import { IProtection } from './IProtection';

export interface INote {
    /** Note id */
    id: number;

    /** Note title */
    name: string;

    /** The content of the note */
    content: string;

    /** Is pinned */
    pinned: boolean;

    /** Protection */
    protection: IProtection;

    /** List of tags connected with note */
    tags: string[];

    /** Date created */
    dateCreated: string;
    /** Date modified */
    dateModified: string;

    /** Reference to left note element */
    leftHTML: HTMLDivElement;

    /** Reference to top element of the note */
    topBarHTML: HTMLDivElement;
    /** Reference to name of the note */
    nameBarHTML: HTMLDivElement;
    /** Reference to text of the note */
    textBarHTML: HTMLDivElement;
    /** Reference to ttags of the note */
    tagsBarHTML: HTMLDivElement;

    /** Build HTML for note */
    buildLeftHTML(): HTMLDivElement;

    /** Choose note */
    choose(): void;

    /** Unchoose note */
    unchoose(): void;

    /** Rebuild top element of the note */
    rebuildLeftAdditions(): void;
    /** Rebuild content of the note */
    rebuildLeftContent(): void;
    /** Rebuild bottom element of the note */
    rebuildLeftTags(): void;

    /** Rebuild everything */
    checkDisplay(): void;

    /** Update note */
    update(name: string, content: string): void;

    /** Add new tag to note */
    addTag(value: string): void;

    /** Remove tag from note */
    removeTag(it: number): void;

    /** Prepare to be removed */
    prepRemove(): void;
}
