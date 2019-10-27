"use strict";
;
;
;
const Settings = {
    initialized: false,
    section: null,
    queue: false,
    init() {
        this.initialized = true;
        this.choose('general');
        /** GENERAL */
        //Sorting
        if (UserSettings.general.sort.type !== 1)
            $id('settings-general-sorting-order').checked = true;
        else if (UserSettings.general.sort.type === 1)
            $id('settings-general-sorting-name').checked = true;
        $id('settings-general-sorting-ascending').checked = UserSettings.general.sort.asc;
        /** APPEARANCE */
        // Categories
        if (UserSettings.appearance.categories.state === 1) {
            $id('settings-appearance-categories-shown').checked = true;
        }
        else if (UserSettings.appearance.categories.state === 2) {
            $id('settings-appearance-categories-hidden').checked = true;
            Left.categories.toggle();
        }
        else {
            $id('settings-appearance-categories-remember').checked = true;
            if (!UserSettings.appearance.categories.shown)
                Left.categories.toggle();
        }
        // Notes
        $id('settings-appearance-notes-showTop').checked = UserSettings.appearance.notes.showTop;
        $id('settings-appearance-notes-showText').checked = UserSettings.appearance.notes.showText;
        $id('settings-appearance-notes-showTags').checked = UserSettings.appearance.notes.showTags;
        // Top bar
        $id('settings-appearance-top-showNotes').checked = UserSettings.appearance.top.addNote;
        $id('settings-appearance-top-showCategories').checked = UserSettings.appearance.top.addCategory;
        Left.checkShowTop();
    },
    open() {
        if (!this.initialized)
            this.init();
        $id('settings').style.display = 'block';
        setTimeout(() => {
            $id('settings').style.opacity = '1';
            $id('settings').style.transform = 'scale(1)';
        }, 50);
    },
    choose(section) {
        if (this.section === section)
            return;
        if (this.queue)
            return;
        this.queue = true;
        if (this.section !== null)
            this.unchoose();
        this.section = section;
        $id(`settings-section-${section}`).setAttribute('name', 'chosen');
        $id(`settings-main-${section}`).style.visibility = 'visible';
        $id(`settings-main-${section}`).style.opacity = '1';
        $id(`settings-main-${section}`).style.transform = 'translateY(0px)';
        setTimeout(() => {
            this.queue = false;
        }, 300);
    },
    unchoose() {
        // For timeout
        let sectionToUnset = this.section;
        $id(`settings-section-${sectionToUnset}`).setAttribute('name', '');
        $id(`settings-main-${sectionToUnset}`).style.opacity = '0';
        $id(`settings-main-${sectionToUnset}`).style.transform = 'translateY(40px)';
        setTimeout(() => {
            $id(`settings-main-${sectionToUnset}`).style.visibility = 'hidden';
            $id(`settings-main-${sectionToUnset}`).style.transform = 'translateY(-40px)';
        }, 200);
    },
    options: {
        general: {
            sortingOrder(no) {
                UserSettings.general.sort.type = no;
                Categories.sort();
                Categories.rebuild();
                if (Left.categories.curr !== null) {
                    Left.categories.curr.sortNotes(Left.categories.curr.notes);
                    Left.categories.curr.rebuildNotes();
                }
            },
            sortingAsc(isAsc) {
                UserSettings.general.sort.asc = isAsc;
                Categories.sort();
                Categories.rebuild();
                if (Left.categories.curr !== null) {
                    Left.categories.curr.sortNotes(Left.categories.curr.notes);
                    Left.categories.curr.rebuildNotes();
                }
            }
        },
        appearance: {
            categoriesState(state) {
                UserSettings.appearance.categories.state = state;
                if (state === 0)
                    UserSettings.appearance.categories.shown = Left.categories.shown;
            },
            notesTopState(shown) {
                UserSettings.appearance.notes.showTop = shown;
                if (Left.categories.curr !== null) {
                    Left.categories.curr.checkNotesDisplay();
                }
            },
            notesTextState(shown) {
                UserSettings.appearance.notes.showText = shown;
                if (Left.categories.curr !== null) {
                    Left.categories.curr.checkNotesDisplay();
                }
            },
            notesTagsState(shown) {
                UserSettings.appearance.notes.showTags = shown;
                if (Left.categories.curr !== null) {
                    Left.categories.curr.checkNotesDisplay();
                }
            },
            addNoteTopState(shown) {
                UserSettings.appearance.top.addNote = shown;
                Left.checkShowTop();
            },
            addCategoryTopState(shown) {
                UserSettings.appearance.top.addCategory = shown;
                Left.checkShowTop();
            }
        }
    },
    keyHandler(ev) {
        if (ev.key === 'Escape')
            this.close();
    },
    assignListeners() {
        $id('settings-section-general').addEventListener('click', () => {
            this.choose('general');
        });
        $id('settings-section-appearance').addEventListener('click', () => {
            this.choose('appearance');
        });
        $id('settings-close').addEventListener('click', () => {
            Settings.close();
        });
        /** Settings */
        function handleClick(str) {
            if (str === 'settings-general-sorting-order')
                Settings.options.general.sortingOrder(0);
            else if (str === 'settings-general-sorting-name')
                Settings.options.general.sortingOrder(1);
            else if (str === 'settings-general-sorting-ascending')
                Settings.options.general.sortingAsc($id(str).checked);
            else if (str === 'settings-appearance-categories-remember')
                Settings.options.appearance.categoriesState(0);
            else if (str === 'settings-appearance-categories-shown')
                Settings.options.appearance.categoriesState(1);
            else if (str === 'settings-appearance-categories-hidden')
                Settings.options.appearance.categoriesState(2);
            else if (str === 'settings-appearance-notes-showTop')
                Settings.options.appearance.notesTopState($id(str).checked);
            else if (str === 'settings-appearance-notes-showText')
                Settings.options.appearance.notesTextState($id(str).checked);
            else if (str === 'settings-appearance-notes-showTags')
                Settings.options.appearance.notesTagsState($id(str).checked);
            else if (str === 'settings-appearance-top-showNotes')
                Settings.options.appearance.addNoteTopState($id(str).checked);
            else if (str === 'settings-appearance-top-showCategories')
                Settings.options.appearance.addCategoryTopState($id(str).checked);
            Main.saveSettings();
        }
        let els = document.querySelectorAll('.settings-checkbox');
        for (let el of els) {
            if (el.dataset.for) {
                el.onclick = () => {
                    $id(el.dataset.for).checked
                        = !$id(el.dataset.for).checked;
                    handleClick(el.dataset.for);
                };
            }
        }
        els = document.querySelectorAll('.settings-radio');
        for (let el of els) {
            if (el.dataset.for) {
                el.onclick = () => {
                    $id(el.dataset.for).checked = true;
                    handleClick(el.dataset.for);
                };
            }
        }
    },
    close() {
        $id('settings').style.opacity = '0';
        $id('settings').style.transform = 'scale(1.2)';
        setTimeout(() => {
            $id('settings').style.display = 'none';
        }, 300);
    }
};
