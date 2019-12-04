import { Category } from '../dataTypes/Category';

export interface ICategories {
    stack: Category[];

    init(data: any): void;
    sort(): void;
    rebuild(): void;
    add(category: Category): void;
    remove(category: Category): void;
    checkState(): void;
};
