interface ICategories {
    stack: Category[];
    init(data: any): void;
    sort(): void;
    rebuild(): void;
    remove(category: Category): void;
}
declare const Categories: ICategories;
