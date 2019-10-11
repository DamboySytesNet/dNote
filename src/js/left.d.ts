interface ILeft {
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
     * Assign listeners
     */
    assignListeners(): void;
    /**
     * Assign key handler
     */
    keyHandler(ev: KeyboardEvent): void;
}
interface ILeftSearch {
    /**
     * Apply search string to notes
     */
    applySearch(): void;
    /**
     * Clear search input
     */
    clear(): void;
}
interface ILeftCategories {
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
     * Checks if there are any categories,
     * to display appropriate message.
     */
    checkState(): void;
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
interface ILeftNotes {
    /**
     * Currently selected note
     */
    curr: Note;
    /**
     * Checks if there are any categories,
     * to display appropriate message.
     */
    checkState(): void;
    /**
     * Removes notes from tab
     */
    clear(): void;
    /**
     * Adds new note to the tab
     * @param obj - note to be added
     */
    add(obj: HTMLDivElement): void;
    /**
     * Updated note
     * @param note - note to be updated
     */
    update(note: Note, onlyOptions: boolean): void;
}
declare const Left: ILeft;
