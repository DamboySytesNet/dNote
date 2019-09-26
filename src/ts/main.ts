interface IProtection {
    active: boolean;
}

interface INote {
    id: number;
    name: string;
    html: HTMLDivElement;
    content: string;
    pinned: boolean;
    protection: IProtection;
    tags: string[];
    dateCreated: string;
    dateModified: string;
}

interface ICategory {
    id: number;
    name: string;
    html: HTMLDivElement;
    color: string;
    notes: INote[];
}

interface IMain {
    data: ICategory[];
    init(): void;
    handleData(): void;
    loadContent(): string;
    saveContent(): boolean;
};

const Main: IMain = {
    data: null,
    
    /**
     * Initialize main content
     */
    init() {
        const dataStr = this.loadContent();

        try {
            this.data = JSON.parse(dataStr);
            this.handleData();
        } catch(e) {
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
        } catch(e) {
            if (e.code === 'ENOENT') {
                FS.writeFileSync('src/data/dNote.json', '[]');
                return '[]';
            } else {
                console.error(['Main.loadContent()', e]);
            }
        }
    },

    saveContent() {
        try {
            FS.writeFileSync('src/data/dNote.json', JSON.stringify(this.data));
            return true;
        } catch(e) {
            console.error(['Main.saveContent()', e]);
            return false;
        }
        return false;
    },
};