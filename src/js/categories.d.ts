interface ICategories {
    stack: Category[];
    init(data: any): void;
    remove(category: Category): void;
}
declare const Categories: ICategories;
