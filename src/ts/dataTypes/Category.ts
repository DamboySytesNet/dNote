import { Note } from './Note';
import { UserSettings } from './UserSettings';

import { Confirm } from '../Confirm';
import { ContextMenu } from '../ContextMenu';
import { Editor } from '../Editor';
import { Left } from '../Left';
import { Main } from '../Main';

import { $id } from '../utils';

export class Category {
    id: number;
    name: string;
    color: string;
    notes: Note[];
    leftHTML: HTMLDivElement;

    constructor(id: number,
        name: string,
        color: string,
        notes: Note[]) {

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
        if (Left.categories.curr !== null)
            Left.categories.curr.unchoose();

        Left.categories.curr = this;
        this.leftHTML.setAttribute('name', 'chosen');

        Left.search.clear();

        if (Left.notes.curr !== null)
            Left.notes.curr.unchoose();
        this.addNotes();
        this.checkNotesDisplay();
        this.checkState();
    }

    unchoose() {
        Left.categories.curr = null;
        Left.notes.checkState();
        Left.notes.clear();
        this.leftHTML.setAttribute('name', '');
    }

    update(name: string, color: string) {
        this.name = name;
        this.color = color;
        Left.categories.update(this);

        Main.saveContent();
    }

    sortNotes(notes: Note[]) {
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
        $id('left-notes-content').innerHTML = '';
        const limit = this.notes.length;
        for (let i = 0; i < limit; i++)
            $id('left-notes-content').appendChild(this.notes[i].leftHTML);
    }

    checkNotesDisplay() {
        this.notes.forEach(note => {
            note.checkDisplay();
        });
    }

    addNotes() {
        const notesLength = this.notes.length;
        for (let i = 0; i < notesLength; i++)
            Left.notes.add(this.notes[i].leftHTML);
    }

    addNote(newNote: Note) {
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

    promptRemoveNote(note: Note) {
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

    removeNote(searchedNote: Note) {
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
        if (Left.categories.curr === this)
            Left.categories.curr.unchoose();

        this.leftHTML.remove();
    }
};
