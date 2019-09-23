"use strict";
;
const Main = {
    data: null,
    /**
     * Initialize main content
     */
    init() {
        const dataStr = this.loadContent();
        try {
            this.data = JSON.parse(dataStr);
            Left.categories.build(this.data);
            Left.categories.choose(0);
        }
        catch (e) {
            console.error(`Main.init(): ${e}`);
        }
    },
    /**
     * Get categories and notes from a file
     */
    loadContent() {
        try {
            return FS.readFileSync('src/data/dNote.json');
        }
        catch (e) {
            console.error(`Main.loadContent(): ${e}`);
        }
    },
};
//# sourceMappingURL=main.js.map