import { ICategory } from '../interfaces/ICategory';
import { INote } from '../interfaces/INote';

import { Confirm } from '../Confirm';
import { ContextMenu } from '../ContextMenu';
import { Editor } from '../Editor';
import { Left } from '../Left';
import { Main } from '../Main';
import { UserSettings } from './UserSettings';

import { $id } from '../utils';

export class Category implements ICategory {
    id: number;
    name: string;
    color: string;
    notes: INote[];
    leftHTML: HTMLDivElement;

    constructor(id: number,
        name: string,
        color: string,
        notes: INote[]) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.notes = this.sortNotes(notes);
        this.leftHTML = this.buildLeftHTML();
    }

    buildLeftHTML(): HTMLDivElement {
        let parent = document.createElement('div') as HTMLDivElement;
        parent.id = `left-category-${this.id}`;
        parent.classList.add('left-category');
        parent.onclick = () => {
            if (Editor.state !== 0) {
                Confirm.open(
                    'Editing',
                    `Are you sure you want to stop editing
                     this note? Any unsaved changes will be lost!`,
                    'Understood',
                    () => {
                        this.choose();
                    });
            } else {
                this.choose();
            }
        }
        parent.oncontextmenu = () => {
            ContextMenu.addToContext('category', this);
        }
        let child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-category-color');
        child.style.background = this.color;
        parent.appendChild(child);

        child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-category-background');
        child.style.background = this.color;
        parent.appendChild(child);

        child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-category-name');
        let subChild = document.createElement('p') as HTMLParagraphElement;
        subChild.innerHTML = this.name;
        child.appendChild(subChild);
        parent.appendChild(child);
        return parent;

        // <div id="left-category-${id}" class="left-category">
        //     <div class="left-category-color"></div>
        //     <div class="left-category-background"></div>
        //     <div class="left-category-name">
        //         <p>{text}</p>
        //     </div>
        // </div>
    }

    choose() {
        // If any other category is chosen, unchoose it
        if (Left.categories.curr !== null)
            Left.categories.curr.unchoose();

        // Update current category
        Left.categories.curr = this;

        // Highlight HTML element
        this.leftHTML.setAttribute('name', 'chosen');

        // Clear search input
        Left.search.clear();

        // If any other note was chosen, unchoose it
        if (Left.notes.curr !== null)
            Left.notes.curr.unchoose();

        // Append notes to tab
        this.rebuildNotes();

        // Check how every note is displayed
        this.checkNotesDisplay();

        // Check if info should be displayed
        this.checkState();
    }

    unchoose() {
        // Set current category as null
        Left.categories.curr = null;

        // Clear notes
        Left.notes.clear();

        // HTML element unchoose
        this.leftHTML.setAttribute('name', '');
    }

    update(name: string, color: string) {
        this.name = name;
        this.color = color;
        Left.categories.update(this);

        Main.saveContent();
    }

    sortNotes(notes: INote[]) {
        return notes.sort((a, b) => {
            if (a.pinned === b.pinned) {
                let sign = UserSettings.general.sort.asc === true ? 1 : -1;

                if (UserSettings.general.sort.type === 1) {
                    return a.name.localeCompare(b.name) * sign;
                } else {
                    return (a.id - b.id) * sign;
                }
            } else if (a.pinned)
                return -1;
            else
                return 1;
        });
    }

    rebuildNotes() {
        Left.notes.clear();

        for (let note of this.notes)
            $id('left-notes-content').appendChild(note.leftHTML);
    }

    checkNotesDisplay() {
        this.notes.forEach(note => {
            note.checkDisplay();
        });
    }

    addNote(newNote: INote) {
        this.notes.push(newNote);
        this.checkState();
    }

    checkState() {
        if (this.notes.length !== 0) {
            $id('left-noCategoryChosen').style.display = 'none';
            $id('left-noNotes').style.display = 'none';
        } else {
            $id('left-noCategoryChosen').style.display = 'none';
            $id('left-noNotes').style.display = 'block';
        }
    }

    promptRemoveNote(note: INote) {
        Confirm.open(
            'Delete a note',
            `You are about to delete a note.
                There is no going back after
                confirmation. Are you sure?`,
            'Remove',
            () => {
                this.removeNote(note);
            }
        );
    }

    removeNote(searchedNote: INote) {
        this.notes.find((note, index) => {
            if (searchedNote === note) {
                note.prepRemove();
                this.notes.splice(index, 1);
                Main.saveContent();
                return true;
            }
            return false;
        });

        this.checkState();
    }

    prepRemove() {
        // If this category is currently selected, then unchoose it
        if (Left.categories.curr === this)
            Left.categories.curr.unchoose();

        // Remove its html body
        this.leftHTML.remove();
    }
};
