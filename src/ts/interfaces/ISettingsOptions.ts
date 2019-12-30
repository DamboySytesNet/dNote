import { ISettingsOptionsGeneral } from './ISettingsOptionsGeneral';
import { ISettingsOptionsAppearance } from './ISettingsOptionsAppearance';

export interface ISettingsOptions {
    /** General settings */
    general: ISettingsOptionsGeneral;

    /** Appearance settings */
    appearance: ISettingsOptionsAppearance;
}
