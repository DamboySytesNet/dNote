export interface ISettingsOptionsAppearance {
    /**
     * Set left categories state
     * @param state 0 - remember, 1 - always shown, 2 - always hidden
     */
    categoriesState(state: number): void;

    /**
     * Set if notes' additions should be displayed
     * @param shown true - yes, false - no
     */
    notesTopState(shown: boolean): void;
    /**
     * Set if notes' content should be displayed
     * @param shown true - yes, false - no
     */
    notesTextState(shown: boolean): void;
    /**
     * Set if notes' tags should be displayed
     * @param shown true - yes, false - no
     */
    notesTagsState(shown: boolean): void;

    /**
     * Set if 'add note' button should be displayed on the top bar
     * @param shown true - yes, false - no
     */
    addNoteTopState(shown: boolean): void;
    /**
     * Set if 'add category' button should be displayed on the top bar
     * @param shown true - yes, false - no
     */
    addCategoryTopState(shown: boolean): void;
}
