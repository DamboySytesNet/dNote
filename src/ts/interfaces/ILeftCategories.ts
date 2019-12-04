import { Category } from '../dataTypes/Category';

export interface ILeftCategories {
    /**
     * Currently selected category
     */
    curr: Category;

    /**
     * State of categories (true: shown, false: hidden)
     */
    shown: boolean;

    /**
     * Initialize data from file
     */
    init(): void;

    /**
     * Toggles folding and unfolding category tab
     */
    toggle(): void;

    /**
     * Add HTML element to left tab
     */
    add(obj: HTMLDivElement): void;

    /**
     * Update HTML element of specific category
     * @param obj - category object to be updated
     */
    update(obj: Category): void;
}
