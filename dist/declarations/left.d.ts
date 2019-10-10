interface ILeft {
    search: ILeftSearch;
    categories: ILeftCategories;
    notes: ILeftNotes;
    assignListeners(): void;
    keyHandler(ev: KeyboardEvent): void;
}
interface ILeftSearch {
    applySearch(): void;
    clear(): void;
}
interface ILeftCategories {
    curr: ICategory;
    shown: boolean;
    toggle(): void;
    build(data: ICategory[]): void;
    add(obj: ICategory): void;
    edit(obj: ICategory, name: string, color: string): void;
    remove(obj: ICategory): void;
    choose(which: ICategory): void;
    createHTML(el: ICategory): HTMLDivElement;
    unselect(): void;
}
interface ILeftNotes {
    curr: INote;
    words: number;
    chars: number;
    noCategory(): void;
    build(data: INote[]): void;
    add(obj: INote): void;
    edit(note: INote): void;
    promptRemove(obj: INote): void;
    remove(obj: INote): void;
    choose(which: INote): void;
    sort(data: INote[]): void;
    createHTML(el: INote): HTMLDivElement;
    unselect(): void;
}
declare const Left: ILeft;
