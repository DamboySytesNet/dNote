interface IProtection {
    protected: boolean;
}
interface INote {
    id: number;
    name: string;
    content: string;
    pinned: boolean;
    protection: IProtection;
    dateCreated: string;
    dateModified: string;
}
interface ICategory {
    id: number;
    name: string;
    color: string;
    notes: INote[];
}
interface IMain {
    data: ICategory[];
    init(): void;
    loadContent(): string;
}
declare const Main: IMain;
