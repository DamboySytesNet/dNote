"use strict";
;
const Main = {
    data: null,
    /**
     * Initialize main content
     */
    init() {
        const dataStr = this.loadContent();
        Content.init();
        try {
            this.data = JSON.parse(dataStr);
            this.handleData();
        }
        catch (e) {
            console.error(['Main.init()', e]);
        }
        $id('left-categories-add').addEventListener('click', () => {
            CategoryDialog.open();
        });
        $id('left-actions-addCategory').addEventListener('click', () => {
            CategoryDialog.open();
        });
    },
    handleData() {
        Left.categories.build(this.data);
        if (this.data.length > 0)
            Left.categories.choose(this.data[0]);
    },
    /**
     * Get categories and notes from a file
     */
    loadContent() {
        try {
            return FS.readFileSync('src/data/dNote.json');
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                if (!FS.existsSync('src/data'))
                    FS.mkdirSync('src/data');
                FS.writeFileSync('src/data/dNote.json', '[]');
                return '[]';
            }
            else {
                console.error(['Main.loadContent()', e]);
            }
        }
    },
    saveContent() {
        try {
            FS.writeFileSync('src/data/dNote.json', JSON.stringify(this.data));
            return true;
        }
        catch (e) {
            console.error(['Main.saveContent()', e]);
            return false;
        }
    },
};
setTimeout(() => {
    Left.categories.choose(Main.data[0]);
    // Content.create();
    Left.notes.choose(Main.data[0].notes[2]);
    Content.changeState(true);
    // Content.options.toggle();
}, 200);
//# sourceMappingURL=main.js.map