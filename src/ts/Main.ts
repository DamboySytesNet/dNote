import * as FS from 'fs';

import { IMain } from './interfaces/IMain';
import { IUserSettings } from './interfaces/IUserSettings';

import { UserSettings, setter as UserSettingsSetter } from './dataTypes/UserSettings';

import { Categories } from './Categories';
import { Editor } from './Editor';
import { Left } from './Left';
import { Settings } from './Settings';

import { $id } from './utils';

export const Main: IMain = {
    filesLoaded: 0,
    filesToLoad: 2,

    init() {
        this.settings.load();

        Editor.init();
    },

    settings: {
        load() {
            const thisRef = this;

            const loadingFailed = (err: any) => {
                // If file not found
                if (err.code === 'ENOENT') {
                    // Create 'data' directory if needed
                    if (!FS.existsSync('./dist/data'))
                        FS.mkdirSync('./dist/data');

                    // Create new data for notes
                    FS.writeFile(
                        './dist/data/settings.json',
                        JSON.stringify(UserSettings),
                        'utf8',
                        () => {
                            thisRef.handle(UserSettings);
                        });
                } else {
                    console.error(['Main.loadSettings()', err]);
                    Main.failure();
                }
            };

            // Read content from file
            FS.readFile(
                './dist/data/settings.json',
                'utf8',
                (err: any, fileContent: string) => {
                    if (err)
                        loadingFailed(err);
                    else
                        this.parse(fileContent);
                },
            );
        },

        parse(strFromFile) {
            let parsedData = [];

            try {
                parsedData = JSON.parse(strFromFile);
                this.handle(parsedData);
            } catch (e) {
                console.error(['Main.init()', e, strFromFile]);
                Main.failure();
            }
        },

        handle(parsedData: IUserSettings) {
            // If default settings are used
            if (UserSettings === parsedData) {
                Main.saveSettings();
            } else {
                // Dumb? way to validate settings
                if (typeof parsedData.general !== 'undefined' &&
                    typeof parsedData.general.sort !== 'undefined' &&
                    typeof parsedData.general.sort.type !== 'undefined' &&
                    typeof parsedData.general.sort.asc !== 'undefined' &&
                    typeof parsedData.appearance !== 'undefined' &&
                    typeof parsedData.appearance.categories !== 'undefined' &&
                    typeof parsedData.appearance.categories.state !== 'undefined' &&
                    typeof parsedData.appearance.categories.shown !== 'undefined' &&
                    typeof parsedData.appearance.notes !== 'undefined' &&
                    typeof parsedData.appearance.notes.showTop !== 'undefined' &&
                    typeof parsedData.appearance.notes.showText !== 'undefined' &&
                    typeof parsedData.appearance.notes.showTags !== 'undefined' &&
                    typeof parsedData.appearance.top !== 'undefined' &&
                    typeof parsedData.appearance.top.addNote !== 'undefined' &&
                    typeof parsedData.appearance.top.addCategory !== 'undefined'
                ) {
                    UserSettingsSetter(parsedData);
                } else {
                    alert('Using default settings...');
                    Main.saveSettings();
                }
            }

            Settings.init();
            Main.content.load();
            Main.stopLoading();
        }
    },

    content: {
        load() {
            const thisRef = this;

            function loadingFailed(err: any) {
                // If file not found
                if (err.code === 'ENOENT') {
                    // Create data dir if needed
                    if (!FS.existsSync('./dist/data'))
                        FS.mkdirSync('./dist/data');

                    // Create new data for notes
                    FS.writeFile(
                        './dist/data/dNote.json',
                        '[]',
                        'utf8',
                        () => {
                            thisRef.handle([]);
                        });
                } else {
                    console.error(['Main.loadContent()', err]);
                    Main.failure();
                }
            };

            // Read content from file
            FS.readFile(
                './dist/data/dNote.json',
                'utf8',
                (err: any, fileContent: string) => {
                    if (err)
                        loadingFailed(err);
                    else
                        this.parse(fileContent);
                }
            );
        },

        parse(strFromFile) {
            let parsedData = [];
            try {
                parsedData = JSON.parse(strFromFile);
            } catch (e) {
                console.error(['Main.init()', e, strFromFile]);
                Main.failure();
            } finally {
                this.handle(parsedData);
            }
        },

        handle(parsedData) {
            Main.stopLoading();

            Categories.init(parsedData);
            Left.categories.init();
        }
    },

    stopLoading() {
        this.filesLoaded++;

        if (this.filesLoaded === this.filesToLoad) {
            $id('loading')
                .style.opacity = '0';

            $id('loading')
                .style.transform = 'translateY(-10px)';

            setTimeout(() => {
                $id('loading')
                    .remove();
            }, 300);
        }
    },

    saveContent() {
        try {
            console.time('Content saved in');
            FS.writeFileSync('./dist/data/dNote.json', JSON.stringify(Categories.stack));
            console.timeEnd('Content saved in');
            return true;
        } catch (e) {
            console.error(['Main.saveContent()', e]);
            return false;
        }
    },

    saveSettings() {
        try {
            console.time('Settings saved in');
            FS.writeFileSync('./dist/data/settings.json', JSON.stringify(UserSettings));
            console.timeEnd('Settings saved in');
            return true;
        } catch (e) {
            console.error(['Main.saveContent()', e]);
            return false;
        }
    },

    failure() {
        alert(`Unfortunately, app was not able to start. It means that it encountered problems with your data. If you changed it manually, it is time to bring backup. To restart data to default rename "data" folder...`);
        window.close();
    }
};
