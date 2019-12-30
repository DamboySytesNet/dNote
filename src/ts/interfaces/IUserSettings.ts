import { IUserSettings_appearance } from './IUserSettings_appearance';
import { IUserSettings_general } from './IUserSettings_general';

export interface IUserSettings {
    /**
     * Settings connected with general tab
     */
    general: IUserSettings_general;
    /**
     * Settings connected with appearance tab
     */
    appearance: IUserSettings_appearance;
}
