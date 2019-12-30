import { IUserSettings_appearance_categories } from './IUserSettings_appearance_categories';
import { IUserSettings_appearance_notes } from './IUserSettings_appearance_notes';
import { IUserSettings_appearance_top } from './IUserSettings_appearance_top';

export interface IUserSettings_appearance {
    /**
     * Settings section connected to left bar with categories
     */
    categories: IUserSettings_appearance_categories;
    /**
     * Settings section connected to notes' display
     */
    notes: IUserSettings_appearance_notes;
    /**
     * Settings section connected to top bar
     */
    top: IUserSettings_appearance_top;
}
