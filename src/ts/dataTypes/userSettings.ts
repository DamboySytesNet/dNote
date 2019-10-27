interface IUserSettings {
    general: IUserSettings_general;
    appearance: IUserSettings_appearance;
};

interface IUserSettings_general {
    sort: IUserSettings_general_sort;
};

interface IUserSettings_general_sort {
    type: number;
    asc: boolean;
};

interface IUserSettings_appearance {
    categories: IUserSettings_appearance_categories;
    notes: IUserSettings_appearance_notes;
    top: IUserSettings_appearance_top;
};

interface IUserSettings_appearance_categories {
    state: number;
    shown: boolean;
};

interface IUserSettings_appearance_notes {
    showTop: boolean;
    showText: boolean;
    showTags: boolean;
};

interface IUserSettings_appearance_top {
    addNote: boolean;
    addCategory: boolean;
};

let UserSettings: IUserSettings = {
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