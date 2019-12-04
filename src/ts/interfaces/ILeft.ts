import { ILeftCategories } from './ILeftCategories';
import { ILeftNotes } from './ILeftNotes';
import { ILeftSearch } from './ILeftSearch';

export interface ILeft {
    /**
     * Handles search
     */
    search: ILeftSearch;

    /**
     * Handles category tab
     */
    categories: ILeftCategories;

    /**
     * Handles note tab
     */
    notes: ILeftNotes;

    /**
     * Checks if icons on top should be display
     * due to user settings
     */
    checkShowTop(): void;

    /**
     * Assign listeners
     */
    assignListeners(): void;

    /**
     * Assign key handler
     */
    keyHandler(ev: KeyboardEvent): void
};
