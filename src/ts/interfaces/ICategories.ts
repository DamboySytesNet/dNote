import { ICategory } from './ICategory';

export interface ICategories {
    /**
     * Stack with all categories
     */
    stack: ICategory[];

    /**
     * Initialize categories from file
     */
    init(data: ICategory[]): void;

    /**
     * Sort categories
     */
    sort(): void;

    /**
     * Clear left and
     */
    rebuild(): void;

    /**
     * Add category to stack and automatically select it
     */
    add(category: ICategory): void;

    /**
     * Remove category from stack
     */
    remove(category: ICategory): void;

    /**
     * Check if additional info is needed to be displayed (eg. no categories)
     */
    checkState(): void;
};
