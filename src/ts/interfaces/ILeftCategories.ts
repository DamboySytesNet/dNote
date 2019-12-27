import { Category } from '../dataTypes/Category';
import { ICategory } from './ICategory';

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
     * Add category element at the end
     * @param category category html element to be inserted
     */
    add(category: HTMLDivElement): void;

    /**
     * Add category element in appropriate place
     */
    addBefore(
        categoryElement: HTMLDivElement,
        referencedElement: HTMLDivElement
    ): void;

    /**
     * Change the position of category to match sorted order
     * @param category category to be moved
     */
    move(category: ICategory): void;

    /**
     * Clear categories and rebuild them
     */
    rebuild(): void;

    /**
     * Remove all categories from tab
     */
    clear(): void;
}
