export interface IContentOptions {
    /** Are editor options toggled  */
    shown: boolean;

    /**
     * Toggle the visibility of the options
     * @param state forced state
     */
    toggle(state?: boolean): void;

    /** Handle the pin toggle button */
    handlePin(): void;

    /** Add new tag */
    addTag(): void;

    /**
     * Remove tag from note
     * @param tagName tag to be removed
     */
    removeTag(tagName: string): void;
}
