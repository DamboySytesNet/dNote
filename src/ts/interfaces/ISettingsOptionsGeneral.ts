export interface ISettingsOptionsGeneral {
    /**
     * What should sort be based on
     * @param no 0 - chronologically, 1 - alphabetically
     */
    sortingOrder(no: number): void;
    /**
     * Sort should be asending or not
     * @param asc ascending
     */
    sortingAsc(asc: boolean): void;
}
