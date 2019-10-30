interface ILeft {
    /**
     * Handles search
     */
    search: ILeftSearch;

    /**
     * Handles category tab
     */
    categories: ILeftCategories;

    /**
     * Handles note tab
     */
    notes: ILeftNotes;

    /**
     * Checks if icons on top should be display
     * due to user settings
     */
    checkShowTop(): void;

    /**
     * Assign listeners
     */
    assignListeners(): void;

    /**
     * Assign key handler
     */
    keyHandler(ev: KeyboardEvent): void
};

interface ILeftSearch {
    /**
     * Apply search string to notes
     */
    applySearch(): void;

    /**
     * Clear search input
     */
    clear(): void;
}

interface ILeftCategories {
    /**
     * Currently selected category
     */
    curr: Category;

    /**
     * State of categories (true: shown, false: hidden)
     */
    shown: boolean;

    /**
     * Initialize data from file
     */
    init(): void;

    /**
     * Checks if there are any categories,
     * to display appropriate message.
     */
    checkState(): void;

    /**
     * Toggles folding and unfolding category tab
     */
    toggle(): void;
    
    /**
     * Add HTML element to left tab
     */
    add(obj: HTMLDivElement): void;

    /**
     * Update HTML element of specific category
     * @param obj - category object to be updated
     */
    update(obj: Category): void;
}

interface ILeftNotes {
    /**
     * Currently selected note 
     */
    curr: Note;

    /**
     * Checks if there are any categories,
     * to display appropriate message.
     */
    checkState(): void;

    /**
     * Removes notes from tab
     */
    clear(): void;

    /**
     * Adds new note to the tab
     * @param obj - note to be added
     */
    add(obj: HTMLDivElement): void;

    /**
     * Updated note
     * @param note - note to be updated
     */
    update(note: Note, onlyOptions: boolean): void;
}

const Left: ILeft = {
    search: {
        applySearch() {
            const value = (<HTMLInputElement>$id('left-notesSearch-input')).value;

            for (let el of Left.categories.curr.notes) {
                if (value === '') {
                    el.leftHTML.style.display = 'block';
                    continue;
                }

                let div = document.createElement('div');
                div.innerHTML = el.content;
                if (el.name.indexOf(value) > -1 ||
                    div.textContent.indexOf(value) > -1 || 
                    el.tags.indexOf(value) > -1)
                        el.leftHTML.style.display = 'block';
                else
                    el.leftHTML.style.display = 'none';
            }
        },

        clear() {
            (<HTMLInputElement>$id('left-notesSearch-input')).value = '';
            this.applySearch();
        }
    },

    categories: {
        curr: null,
        shown: true,

        init() {
            // Add all categories to left tab
            const categoriesLength = Categories.stack.length;
            for (let i = 0; i < categoriesLength; i++)
                this.add(Categories.stack[i].leftHTML);

            // Select first category as default if exists
            if (Categories.stack.length !== 0)
                Categories.stack[0].choose();

            this.checkState();
        },

        checkState() {
            if (Categories.stack.length !== 0)
                $id('left-noCategories').style.display = 'none';
            else
                $id('left-noCategories').style.display = 'block';
        },

        toggle() {
            this.shown = !this.shown;

            if (this.shown) {
                $id('left-categories').style.width = '240px';
                $id('left-notes').style.width = 'calc(100% - 241px)';
            } else {
                $id('left-categories').style.width = '0px';
                $id('left-notes').style.width = 'calc(100% - 1px)';
            }
            
            if (UserSettings.appearance.categories.state === 0) {
                UserSettings.appearance.categories.shown = this.shown;
                Main.saveSettings();
            }
        },

        add(category) {
            $id('left-categories-content')
                .appendChild(category);
        },

        update(category) {
            (<HTMLDivElement>category.leftHTML
                .querySelector('.left-category-color'))
                .style.background = category.color;

            (<HTMLDivElement>category.leftHTML
                .querySelector('.left-category-background'))
                .style.background = category.color;

            (<HTMLDivElement>category.leftHTML
                .querySelector('.left-category-name > p'))
                .innerHTML = category.name;
        },
    },

    notes: {
        curr: null,

        checkState() {
            if (Left.categories.curr === null) {
                $id('left-noCategoryChosen').style.display = 'block';
                $id('left-noNotes').style.display = 'none';
            } else {
                if (Left.categories.curr.notes.length !== 0) {
                    $id('left-noCategoryChosen').style.display = 'none';
                    $id('left-noNotes').style.display = 'none';
                } else {
                    $id('left-noCategoryChosen').style.display = 'none';
                    $id('left-noNotes').style.display = 'block';
                }
            }
        },

        clear() {
            $id('left-notes-content').innerHTML = '';
        },

        add(note) {
            $id('left-notes-content')
                .appendChild(note);
        },
        
        update(note, onlyOptions) {
            let topPart = note.leftHTML.querySelector('.left-note-additions');
            
            topPart.innerHTML = '';
            let img;
            if (note.pinned) {
                img = new Image();
                img.src = 'icons/common/pin_color.png';
                img.setAttribute('name', 'left');
                img.alt = 'Pinned';
                img.title = 'Pinned';
                topPart.appendChild(img);
            }

            if (note.protection.active) {
                img = new Image();
                img.src = 'icons/common/lock_color.png';
                img.setAttribute('name', 'right');
                img.alt = 'Password protected';
                img.title = 'Password protected';
                topPart.appendChild(img);
            }

            let tagPart = note.leftHTML.querySelector('.left-note-tags');
            tagPart.innerHTML = '';

            const limit = note.tags.length > 5 ? 5 : note.tags.length;

            for (let i = 0; i < limit; i++) {
                let tag = document.createElement('span') as HTMLSpanElement;
                tag.innerHTML = note.tags[i];
                tag.onclick = ev => {
                    ev.stopPropagation();
                    (<HTMLInputElement>$id('left-notesSearch-input')).value = note.tags[i];
                    Left.search.applySearch();
                }
                tagPart.appendChild(tag);
            }

            $id('footer-mDate').innerHTML = note.dateModified;

            if (onlyOptions) {
                note.leftHTML.querySelector('.left-note-name')
                    .innerHTML = note.name;

                let tmp = document.createElement('div') as HTMLDivElement;
                tmp.innerHTML = note.content.substr(0, 150);
                
                note.leftHTML.querySelector('.left-note-text > p')
                    .innerHTML = getTextFromDOM(tmp);
            }

            note.checkDisplay();
        }
    },

    checkShowTop() {
        if (UserSettings.appearance.top.addNote)
            $id('left-actions-addNote').style.display = 'block';
        else
            $id('left-actions-addNote').style.display = 'none';

        if (UserSettings.appearance.top.addCategory)
            $id('left-actions-addCategory').style.display = 'block';
        else
            $id('left-actions-addCategory').style.display = 'none';
    },

    assignListeners(): void {
        $id('left-notesSearch-input')
            .addEventListener('keyup', () => Left.search.applySearch());

        $id('left-actions-addNote')
            .addEventListener('click', () => Editor.open(true));

        $id('left-notes-add')
            .addEventListener('click', () => Editor.open(true));
            
        $id('left-notesSearch-clear')
            .addEventListener('click', () => {
                Left.search.clear();
                $id('left-notesSearch-input').focus();
            });

        $id('left-actions-menu')
            .addEventListener('click', () => Left.categories.toggle());
    },

    keyHandler(ev) {
        if (ev.key === 'Escape') {
            
        }
    }
}