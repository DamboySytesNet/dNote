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
    build(data: ICategory[]): void;
    add(obj: ICategory): void;
    edit(obj: ICategory, name: string, color: string): void;
    remove(obj: ICategory): void;
    choose(which: ICategory): void;
    createHTML(el: ICategory): HTMLDivElement;
    unselect(): void;
}
interface ILeftNotes {
    noCategory(): void;
    build(data: INote[]): void;
    choose(which: INote): void;
    sort(data: INote[]): void;
    createHTML(el: INote): HTMLDivElement;
}
declare const Left: ILeft;
