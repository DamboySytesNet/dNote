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
    dateCreated: string;
    dateModified: string;
}

interface ICategory {
    id: number;
    name: string;
    html: HTMLDivElement;
    color: string;
    rgba: string;
    notes: INote[];
}

interface IMain {
    data: ICategory[];
    initData(): void;
    init(): void;
    loadContent(): string;
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

            this.initData();

            Left.categories.build(this.data);
            if (this.data.length > 0)
                Left.categories.choose(this.data[0]);
        } catch(e) {
            console.error(`Main.init(): ${e}`);
        }
    },

    //? NOT NEEDED
    initData() {
        // for (let el of this.data) {
        //     el.rgba = `${el.color.substr(0, el.color.length - 1)}, 0.2)`;
        // }
    },

    /**
     * Get categories and notes from a file
     */
    loadContent() {
        try {
            return FS.readFileSync('src/data/dNote.json');
        } catch(e) {
            console.error(`Main.loadContent(): ${e}`);
        }
    },
};