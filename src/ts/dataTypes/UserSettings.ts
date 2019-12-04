import { IUserSettings } from '../interfaces/IUserSettings';

export let UserSettings: IUserSettings = {
    general: {
        sort: {
            type: 0,
            asc: true
        }
    },

    appearance: {
        categories: {
            state: 0,
            shown: true
        },
        notes: {
            showTop: true,
            showText: true,
            showTags: true
        },
        top: {
            addNote: true,
            addCategory: true
        }
    }
};

export function setter(newUserSettings: IUserSettings) {
    UserSettings = newUserSettings;
};
