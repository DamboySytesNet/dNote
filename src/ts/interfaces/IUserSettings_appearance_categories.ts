export interface IUserSettings_appearance_categories {
    /**
     * Controls the state of category state
     * 0 - remember,
     * 1 - always shown,
     * 2 - always hidden
     */
    state: number;

    /**
     * Remember if is shown in case state is set to remember
     */
    shown: boolean;
}
