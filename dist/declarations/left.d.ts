interface ILeft {
    search: ILeftSearch;
    categories: ILeftCategories;
    notes: ILeftNotes;
    assignHandlers(): void;
    keyHandler(ev: KeyboardEvent): void;
}
interface ILeftSearch {
    shown: boolean;
    toggle(): void;
    clear(): void;
}
interface ILeftCategories {
    curr: number;
    build(data: ICategory[]): void;
    choose(which: number): void;
    createHTML(id: number, name: string, color: string): HTMLDivElement;
}
interface ILeftNotes {
    build(data: INote[]): void;
    choose(which: number): void;
    createHTML(id: number, name: string, pinned: boolean, protected: boolean, contentPreview: string): HTMLDivElement;
}
declare const Left: ILeft;
