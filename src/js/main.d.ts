interface IProtection {
    active: boolean;
}
interface INote {
    id: number;
    name: string;
    html: HTMLDivElement;
    content: string;
    pinned: boolean;
    protection: IProtection;
    dateCreated: string;
    dateModified: string;
}
interface ICategory {
    id: number;
    name: string;
    html: HTMLDivElement;
    color: string;
    notes: INote[];
}
interface IMain {
    data: ICategory[];
    init(): void;
    handleData(): void;
    loadContent(): string;
    saveContent(): boolean;
}
declare const Main: IMain;
