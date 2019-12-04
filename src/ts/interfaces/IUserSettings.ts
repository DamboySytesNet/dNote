import { IUserSettings_appearance } from './IUserSettings_appearance';
import { IUserSettings_general } from './IUserSettings_general';

export interface IUserSettings {
    general: IUserSettings_general;
    appearance: IUserSettings_appearance;
};
