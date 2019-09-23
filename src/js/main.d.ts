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
    rgba: string;
    notes: INote[];
}
interface IMain {
    data: ICategory[];
    initData(): void;
    init(): void;
    loadContent(): string;
}
declare const Main: IMain;
