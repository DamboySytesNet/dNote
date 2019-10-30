
interface IMain {
    /**
     * Number of files that already has been read to app
     */
    filesLoaded: number;

    /**
     * Number of files that has to be read to app
     */
    filesToLoad: number;

    /**
     * Initialize app
     */
    init(): void;

    content: IMainFileHandlers;
    settings: IMainFileHandlers;

    /**
     * Stop main loading
     */
    stopLoading(): void;
    
    /**
     * Save current categories and notes to a file
     */
    saveContent(): void;

    /**
     * Save current settings to a file
     */
    saveSettings(): void;

    /**
     * Inform user about failure in reading files and exit app afterwards
     */
    failure(): void;
};

interface IMainFileHandlers {
    /**
     * Init loading
     */
    init(): void;

    /**
     * Load data from file
     */
    load(): void;

    /**
     * Parse settings from file and handle it
     * @param strFromFile - string from file to parse
     */
    parse(strFromFile: string): void;

    /**
     * Handle parsed data
     * @param parsedData - parsed data to handle
     */
    handle(parsedData: any): void;
};

const Main: IMain = {
    filesLoaded: 0,
    filesToLoad: 2,

    init() {
        this.settings.init();
        
        Editor.init();

        //? not its place
        $id('left-actions-settings').addEventListener('click', () => {
            Settings.open();
        });

        $id('left-categories-add').addEventListener('click', () => {
            CategoryDialog.open();
        });

        $id('left-actions-addCategory').addEventListener('click', () => {
            CategoryDialog.open();
        });
    },

    content: {
        init() {
            this.load();
        },

        load() {
            try {
                // Read content from file
                FS.readFile(
                    'src/data/dNote.json',
                    'utf8',
                    (err: any, fileContent: string) => {
                        if (err)
                            throw err;
                        this.parse(fileContent);
                    }
                );
            } catch(e) {
                // If file not found
                if (e.code === 'ENOENT') {
                    // Create data dir if needed
                    if (!FS.existsSync('src/data'))
                        FS.mkdirSync('src/data');
                    
                    // Create new data for notes
                    FS.writeFile(
                        'src/data/dNote.json',
                        '[]',
                        'utf8',
                        () => {
                            this.handle([]);
                        });
                } else {
                    console.error(['Main.loadContent()', e]);
                    Main.failure();
                }
            }
        },

        parse(strFromFile) {
            let parsedData = [];
            try {
                parsedData = JSON.parse(strFromFile);
            } catch(e) {
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

    settings: {
        init() {
            this.load();
        },

        load() {
            try {
                // Read content from file
                FS.readFile(
                    'src/data/settings.json',
                    'utf8',
                    (err: any, fileContent: string) => {
                        if (err)
                            throw err;
                        this.parse(fileContent);
                    }
                );
            } catch(e) {
                // If file not found
                if (e.code === 'ENOENT') {
                    // Create data dir if needed
                    if (!FS.existsSync('src/data'))
                        FS.mkdirSync('src/data');
                    
                    // Create new data for notes
                    FS.writeFile(
                        'src/data/settings.json',
                        JSON.stringify(UserSettings),
                        'utf8',
                        () => {
                            this.handle(UserSettings);
                        });
                } else {
                    console.error(['Main.loadSettings()', e]);
                    Main.failure();
                }
            }
        },

        parse(strFromFile) {
            let parsedData = [];
            try {
                parsedData = JSON.parse(strFromFile);
            } catch(e) {
                console.error(['Main.init()', e, strFromFile]);
                Main.failure();
            } finally {
                this.handle(parsedData);
            }
        },

        handle(parsedData: IUserSettings) {
            if (UserSettings === parsedData)
                return;
            
            // Dumb? way to validate if settings are ok
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
                UserSettings = parsedData;
                Settings.init();
                Main.content.init();
                Main.stopLoading();
            } else {
                alert('Using default settings...');
            }
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
        console.log('saved');
        try {
            FS.writeFileSync('src/data/dNote.json', JSON.stringify(Categories.stack));
            return true;
        } catch(e) {
            console.error(['Main.saveContent()', e]);
            return false;
        }
    },

    saveSettings() {
        try {
            FS.writeFileSync('src/data/settings.json', JSON.stringify(UserSettings));
            return true;
        } catch(e) {
            console.error(['Main.saveContent()', e]);
            return false;
        }
    },

    failure() {
        confirm(`Unfortunately, app was not able to start. It means that it encountered problems with your data. If you changed it manually, it is time to bring backup. To restart data to default rename "data" folder...`);
        window.close();
    }
};

// setTimeout(() => {
//     Settings.open();
// }, 200);