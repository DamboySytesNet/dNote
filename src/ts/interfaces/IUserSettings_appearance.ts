import { IUserSettings_appearance_categories } from './IUserSettings_appearance_categories';
import { IUserSettings_appearance_notes } from './IUserSettings_appearance_notes';
import { IUserSettings_appearance_top } from './IUserSettings_appearance_top';

export interface IUserSettings_appearance {
    categories: IUserSettings_appearance_categories;
    notes: IUserSettings_appearance_notes;
    top: IUserSettings_appearance_top;
};
