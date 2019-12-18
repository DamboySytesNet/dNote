export interface ILeftSearch {
    /**
     * Search notes that contain parameter
     * or else if parameter is not specified, read value from input
     * @param searchedValue - search for specific string in notes
     */
    applySearch(searchedValue?: string): void;

    /**
     * Clear search input
     */
    clear(): void;
}
