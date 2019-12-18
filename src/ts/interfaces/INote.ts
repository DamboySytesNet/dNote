import { IProtection } from './IProtection';

export interface INote {
    id: number;
    name: string;
    content: string;
    pinned: boolean;
    protection: IProtection;
    tags: string[];
    dateCreated: string;
    dateModified: string;

    leftHTML: HTMLDivElement;

    topBarHTML: HTMLDivElement;
    nameBarHTML: HTMLDivElement;
    textBarHTML: HTMLDivElement;
    tagsBarHTML: HTMLDivElement;

    buildLeftHTML(): HTMLDivElement;

    choose(): void;

    unchoose(): void;

    checkDisplay(): void;

    update(name: string, content: string): void;

    addTag(value: string): void;

    removeTag(it: number): void;

    prepRemove(): void;
};
