
interface IMain {
    /**
     * Initialize app
     */
    init(): void;

    /**
     * Get categories and notes from a file
     */
    loadContent(): void;

    /**
     * Parse data from file
     * @param strToParse - string from file to parse
     */
    parseData(strToParse: string): void;

    /**
     * Handle parsed data
     * @param data - parsed data to handle
     */
    handleData(data: any): void;

    /**
     * Stop main loading
     */
    stopLoading(): void;
    
    /**
     * Save current categories and notes to a file
     */
    saveContent(): void;
};

const Main: IMain = {
    init() {
        this.loadContent();
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

    loadContent() {
        try {
            // Read content from file
            FS.readFile(
                'src/data/dNote.json',
                'utf8',
                (err: any, fileContent: string) => {
                    if (err)
                        throw err;
                    this.parseData(fileContent);
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
                        this.handleData([]);
                    });
            } else {
                console.error(['Main.loadContent()', e]);
            }
        }
    },

    parseData(strToParse) {
        let parsedData = [];
        try {
            parsedData = JSON.parse(strToParse);
        } catch(e) {
            console.error(['Main.init()', e]);
        } finally {
            this.handleData(parsedData);
        }
    },

    handleData(data) {
        Categories.init(data);
        this.stopLoading();

        Left.categories.init();
        // Left.categories.build(data);
    },

    stopLoading() {
        $id('loading')
            .style.opacity = '0';

        $id('loading')
            .style.transform = 'translateY(-10px)';

        setTimeout(() => {
            $id('loading')
                .remove();
        }, 300);
    },

    saveContent() {
        try {
            FS.writeFileSync('src/data/dNote.json', JSON.stringify(Categories.stack));
            return true;
        } catch(e) {
            console.error(['Main.saveContent()', e]);
            return false;
        }
    },
};

setTimeout(() => {
    // Settings.open();
    // Left.categories.choose(Main.data[0]);
    // Content.create();
    // Left.notes.choose(Main.data[0].notes[2]);
    // Content.changeState(true);
    // Content.options.toggle();
}, 200);