import { ILeft } from './interfaces/ILeft';

import { UserSettings } from './dataTypes/UserSettings';

import { Categories } from './Categories';
import { CategoryDialog } from './CategoryDialog';
import { Editor } from './Editor';
import { Main } from './Main';
import { Settings } from './Settings';

import { $id, getTextFromDOM } from './utils';

const pinColorImg = require('../icons/common/pin_color.png');
const lockColorImg = require('../icons/common/lock_color.png');

export const Left: ILeft = {
    search: {
        applySearch(searchedValue) {
            if (typeof searchedValue !== 'undefined')
                (<HTMLInputElement>(
                    $id('left-notesSearch-input')
                )).value = searchedValue;

            const value = (<HTMLInputElement>$id('left-notesSearch-input'))
                .value;

            for (let el of Left.categories.curr.notes) {
                if (value === '') {
                    el.leftHTML.style.display = 'block';
                    continue;
                }

                let div = document.createElement('div');
                div.innerHTML = el.content;
                if (
                    el.name.includes(value) ||
                    div.textContent.includes(value) ||
                    el.tags.includes(value)
                )
                    el.leftHTML.style.display = 'block';
                else el.leftHTML.style.display = 'none';
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
            Categories.stack.forEach(category => {
                $id('left-categories-content').appendChild(category.leftHTML);
            });

            // Select first category as default if exists
            if (Categories.stack.length !== 0) Categories.stack[0].choose();
        },

        toggle() {
            //Show / hide
            this.shown = !this.shown;

            if (this.shown) {
                $id('left-categories').style.width = '240px';
                $id('left-notes').style.width = 'calc(100% - 241px)';
            } else {
                $id('left-categories').style.width = '0px';
                $id('left-notes').style.width = 'calc(100% - 1px)';
            }

            // Save state
            if (UserSettings.appearance.categories.state === 0) {
                UserSettings.appearance.categories.shown = this.shown;
                Main.saveSettings();
            }
        },

        add(categoryElement) {
            $id('left-categories-content').appendChild(categoryElement);
        },

        addBefore(categoryElement, referencedElement) {
            $id('left-categories-content').insertBefore(
                categoryElement,
                referencedElement
            );
        },

        move(categoryElement) {
            if (Categories.stack.length > 1) {
                categoryElement.leftHTML.remove();

                // Get the index of category that should be after new one
                const nextCategoryIndex =
                    Categories.stack.indexOf(categoryElement) + 1;

                // If is not last
                if (nextCategoryIndex !== Categories.stack.length) {
                    // Insert into appropriate place
                    this.addBefore(
                        categoryElement.leftHTML,
                        Categories.stack[nextCategoryIndex].leftHTML
                    );
                } else {
                    // Insert at the end
                    this.add(categoryElement.leftHTML);
                }
            }
        },

        rebuild() {
            this.clear();

            Categories.stack.forEach(category => {
                $id('left-categories-content').appendChild(category.leftHTML);
            });
        },

        clear() {
            $id('left-categories-content').innerHTML = '';
        }
    },

    notes: {
        curr: null,

        checkState() {
            if (Left.categories.curr === null) {
                $id('left-noCategoryChosen').style.display = 'block';
                $id('left-noNotes').style.display = 'none';
            } else {
                Left.categories.curr.checkState();
            }
        },

        add(note) {
            $id('left-notes-content').appendChild(note);
        },

        addBefore(noteElement, referencedElement) {
            $id('left-notes-content').insertBefore(
                noteElement,
                referencedElement
            );
        },

        move(noteElement) {
            if (Left.categories.curr.notes.length > 1) {
                // Sort notes
                Left.categories.curr.sortNotes();

                // Get the index of note that should be after new one
                const nextNoteIndex =
                    Left.categories.curr.notes.indexOf(noteElement) + 1;

                // If is not last
                if (nextNoteIndex !== Left.categories.curr.notes.length) {
                    // Insert into appropriate place
                    Left.notes.addBefore(
                        noteElement.leftHTML,
                        Left.categories.curr.notes[nextNoteIndex].leftHTML
                    );
                } else {
                    // Insert at the end
                    Left.notes.add(noteElement.leftHTML);
                }
            } else {
                // Insert
                Left.notes.add(noteElement.leftHTML);
            }
        },

        rebuild() {
            this.clear();

            Left.categories.curr.notes.forEach(note => {
                $id('left-notes-content').appendChild(note.leftHTML);
            });
        },

        clear() {
            $id('left-notes-content').innerHTML = '';
        }
    },

    checkShowTop() {
        if (UserSettings.appearance.top.addNote)
            $id('left-actions-addNote').style.display = 'block';
        else $id('left-actions-addNote').style.display = 'none';

        if (UserSettings.appearance.top.addCategory)
            $id('left-actions-addCategory').style.display = 'block';
        else $id('left-actions-addCategory').style.display = 'none';
    },

    assignListeners(): void {
        $id('left-actions-settings').addEventListener('click', () => {
            Settings.open();
        });

        $id('left-categories-add').addEventListener('click', () => {
            CategoryDialog.open();
        });

        $id('left-actions-addCategory').addEventListener('click', () => {
            CategoryDialog.open();
        });

        $id('left-notesSearch-input').addEventListener('keyup', () =>
            Left.search.applySearch()
        );

        $id('left-actions-addNote').addEventListener('click', () =>
            Editor.newMode.open()
        );

        $id('left-notes-add').addEventListener('click', () =>
            Editor.newMode.open()
        );

        $id('left-notesSearch-clear').addEventListener('click', () => {
            Left.search.clear();
            $id('left-notesSearch-input').focus();
        });

        $id('left-actions-menu').addEventListener('click', () =>
            Left.categories.toggle()
        );
    }

    // keyHandler(ev) {
    //     if (ev.key === 'Escape') {
    //
    //     }
    // }
};
