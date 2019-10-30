"use strict";
class Category {
    constructor(id, name, color, notes) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.notes = this.sortNotes(notes);
        this.leftHTML = this.buildLeftHTML();
    }
    buildLeftHTML() {
        let parent = document.createElement('div');
        parent.id = `left-category-${this.id}`;
        parent.classList.add('left-category');
        parent.onclick = () => {
            if (Editor.state !== 0) {
                Confirm.open('Editing', `Are you sure you want to stop editing
                     this note? Any unsaved changes will be lost!`, 'Understood', () => {
                    this.choose();
                });
            }
            else {
                this.choose();
            }
        };
        parent.oncontextmenu = () => {
            ContextMenu.addToContext('category', this);
        };
        let child = document.createElement('div');
        child.classList.add('left-category-color');
        child.style.background = this.color;
        parent.appendChild(child);
        child = document.createElement('div');
        child.classList.add('left-category-background');
        child.style.background = this.color;
        parent.appendChild(child);
        child = document.createElement('div');
        child.classList.add('left-category-name');
        let subChild = document.createElement('p');
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
    }
    unchoose() {
        Left.categories.curr = null;
        Left.notes.checkState();
        Left.notes.clear();
        this.leftHTML.setAttribute('name', '');
    }
    update(name, color) {
        this.name = name;
        this.color = color;
        Left.categories.update(this);
        Main.saveContent();
    }
    sortNotes(notes) {
        return notes.sort((a, b) => {
            if (a.pinned === b.pinned) {
                let sign = UserSettings.general.sort.asc === true ? 1 : -1;
                if (UserSettings.general.sort.type === 1) {
                    return a.name.localeCompare(b.name) * sign;
                }
                else {
                    return (a.id - b.id) * sign;
                }
            }
            else if (a.pinned)
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
        for (let i = 0; i < notesLength; i++) {
            Left.notes.add(this.notes[i].leftHTML);
        }
        Left.notes.checkState();
    }
    promptRemoveNote(note) {
        Confirm.open('Delete a note', `You are about to delete a note.
                There is no going back after
                confirmation. Are you sure?`, 'Remove', () => {
            this.removeNote(note);
        });
    }
    removeNote(searchedNote) {
        this.notes.find((note, index) => {
            if (searchedNote === note) {
                note.prepRemove();
                this.notes.splice(index, 1);
                Main.saveContent();
                return true;
            }
            return false;
        });
    }
    prepRemove() {
        if (Left.categories.curr === this)
            Left.categories.curr.unchoose();
        this.leftHTML.remove();
    }
}
;
