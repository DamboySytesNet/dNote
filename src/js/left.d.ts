interface ILeft {
    search: ILeftSearch;
    categories: ILeftCategories;
    notes: ILeftNotes;
    assignListeners(): void;
    keyHandler(ev: KeyboardEvent): void;
}
interface ILeftSearch {
    shown: boolean;
    toggle(): void;
    clear(): void;
}
interface ILeftCategories {
    curr: ICategory;
    build(data: ICategory[]): void;
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
