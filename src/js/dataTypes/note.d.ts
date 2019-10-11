interface IProtection {
    active: boolean;
}
declare class Note {
    id: number;
    name: string;
    content: string;
    pinned: boolean;
    protection: IProtection;
    tags: string[];
    dateCreated: string;
    dateModified: string;
    leftHTML: HTMLDivElement;
    constructor(id: number, name: string, content: string, pinned: boolean, protection: IProtection, tags: string[], dateCreated: string, dateModified: string);
    buildLeftHTML(): HTMLDivElement;
    choose(): void;
    unchoose(): void;
    update(name: string, content: string): void;
    addTag(value: string): void;
    removeTag(it: number): void;
    prepRemove(): void;
}
