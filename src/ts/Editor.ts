import { IEditor } from './interfaces/IEditor';

import { Note } from './dataTypes/Note';

import { Alert } from './Alert';
import { ColorPicker } from './ColorPicker';
import { Confirm } from './Confirm';
import { Input } from './Input';
import { Left } from './Left';
import { Main } from './Main';
import { NoteInfo } from './NoteInfo';

import { $, $id, DefaultColors, formatDate, toArray, getTextFromDOM } from './utils';

const editColor = require('../icons/common/edit_color.png');
const eyeColor = require('../icons/common/eye_color.png');

export const Editor: IEditor = {
    state: 0,
    editorViewed: false,
    editorEdited: false,

    chosenColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    chosenColorsCallbacks: [null, null, null, null],
    words: 0,
    chars: 0,

    newTags: [],

    cursorPos: null,

    init() {
        function initColors(section: string) {
            const limit = 8; // two rows, 4 each
            for (let i = 0; i < limit; i++) {
                $id(`main-note-edit-${section}Color-d${i + 1}`).dataset.color = DefaultColors[i];
                $id(`main-note-edit-${section}Color-d${i + 1}`).style.background = DefaultColors[i];

                $id(`main-note-edit-${section}Color-d${i + 1}`).addEventListener('click', ev => {
                    Editor.restoreSelection();
                    document.execCommand(`${section}Color`, false, DefaultColors[i]);
                    ev.stopPropagation();
                });
            }

            $id(`main-note-edit-${section}Color-button`).addEventListener('click', () => {
                ColorPicker.open((val: string) => {
                    Editor.restoreSelection();
                    document.execCommand(`${section}Color`, false, val);
                    Editor.chosenColors.unshift(val);
                    Editor.chosenColors.pop();
                    Editor.colorCustomColors();
                });
            });
        }

        initColors('fore');
        initColors('back');
        this.colorCustomColors();

        const limit = 5;
        for (let i = 1; i <= limit; i++) {
            $id(`main-note-edit-heading-${i}`).addEventListener('click', () => {
                Editor.restoreSelection();
                document.execCommand('formatBlock', false, `H${i}`);
            });
        }

        $id('main-note-edit-heading-0').addEventListener('click', () => {
            Editor.restoreSelection();
            document.execCommand('formatBlock', false, 'div');
        });
    },

    colorCustomColors() {
        const limit = 4; // one row, 4 colors
        for (let i = 0; i < limit; i++) {
            let color = this.chosenColors[i];
            //FORE

            $id(`main-note-edit-foreColor-c${i + 1}`).dataset.color = color;
            $id(`main-note-edit-foreColor-c${i + 1}`).style.background = color;

            if (this.chosenColorsCallbacks[i] !== null)
                $id(`main-note-edit-foreColor-c${i + 1}`).removeEventListener('click', this.chosenColorsCallbacks[i]);

            this.chosenColorsCallbacks[i] = (ev: MouseEvent) => {
                Editor.restoreSelection();
                document.execCommand('foreColor', false, color);
                ev.stopPropagation();
            }
            $id(`main-note-edit-foreColor-c${i + 1}`).addEventListener('click', this.chosenColorsCallbacks[i]);

            // BACK
            $id(`main-note-edit-backColor-c${i + 1}`).dataset.color = color;
            $id(`main-note-edit-backColor-c${i + 1}`).style.background = color;

            if (this.chosenColorsCallbacks[i] !== null)
                $id(`main-note-edit-backColor-c${i + 1}`).removeEventListener('click', this.chosenColorsCallbacks[i]);

            this.chosenColorsCallbacks[i] = (ev: MouseEvent) => {
                Editor.restoreSelection();
                document.execCommand('backColor', false, color);
                ev.stopPropagation();
            }
            $id(`main-note-edit-backColor-c${i + 1}`).addEventListener('click', this.chosenColorsCallbacks[i]);
        }
    },

    checkState() {
        // Adjust visible things based on state
        if (this.state === 0) {
            $id('main-note-notChosen').style.display = 'none';
            $id('main-note-view').style.display = 'block';
            $id('main-note-edit').style.display = 'none';

            $id('main-actions-state').style.display = 'block';
            $id('main-actions-info').style.display = 'block';
            $id('main-actions-delete').style.display = 'block';

            (<HTMLImageElement>$id('main-actions-state'))
                .src = editColor;
            $id('main-actions-name').style.display = 'block'
            $id('main-actions-name').setAttribute('name', '');
            (<HTMLInputElement>$id('main-actions-nameInput'))
                .disabled = true;

            $id('main-note-edit-buttons').style.right = '-170px';

            $id('footer-main-p1').style.display = 'block';
            $id('footer-main-p2').style.display = 'block';
        } else if (this.state === 1) {
            $id('main-note-notChosen').style.display = 'none';
            $id('main-note-view').style.display = 'none';
            $id('main-note-edit').style.display = 'block';

            $id('main-actions-state').style.display = 'block';
            $id('main-actions-info').style.display = 'block';
            $id('main-actions-delete').style.display = 'block';

            (<HTMLImageElement>$id('main-actions-state'))
                .src = eyeColor;
            $id('main-actions-name').style.display = 'block'
            $id('main-actions-name').setAttribute('name', '');
            (<HTMLInputElement>$id('main-actions-nameInput'))
                .disabled = false;

            $id('main-note-edit-buttons').style.right = '10px';

            $id('footer-main-p1').style.display = 'block';
            $id('footer-main-p2').style.display = 'block';
        } else if (this.state === 2) {
            $id('main-note-notChosen').style.display = 'none';
            $id('main-note-view').style.display = 'none';
            $id('main-note-edit').style.display = 'block';

            $id('main-actions-state').style.display = 'none';
            $id('main-actions-info').style.display = 'none';
            $id('main-actions-delete').style.display = 'none';

            $id('main-actions-name').style.display = 'block'
            $id('main-actions-name').setAttribute('name', 'full');
            (<HTMLInputElement>$id('main-actions-nameInput'))
                .disabled = false;

            $id('main-note-edit-buttons').style.right = '10px';

            $id('footer-main-p1').style.display = 'none';
            $id('footer-main-p2').style.display = 'none';
        }
    },

    changeState(state) {
        this.state = state;
        this.newTags = [];
        this.checkState();
    },

    open(newNote = false) {
        if (Left.notes.curr !== null && newNote === false) {
            this.editorViewed = false;
            this.editorEdited = false;
            this.displayNote();
        } else {
            if (Left.notes.curr !== null)
                Left.notes.curr.unchoose();
            this.newNote();
        }
    },

    displayNote() {
        this.changeState(0);

        let note = Left.notes.curr;

        if (!this.editorViewed) {
            this.editorViewed = true;

            $id('main-note-view').innerHTML = note.content;


            (<HTMLInputElement>$id('main-actions-nameInput')).value
                = note.name;

            this.words = getTextFromDOM($id('main-note-view'))
                .split(' ').length;
            this.chars = $id('main-note-view').textContent.length;

            $id('footer-words').innerHTML = this.words.toString();
            $id('footer-chars').innerHTML = this.chars.toString();
            $id('footer-cDate').innerHTML = note.dateCreated;
            $id('footer-mDate').innerHTML = note.dateModified;
        }
    },

    editNote() {
        this.changeState(1);

        let note = Left.notes.curr;

        if (!this.editorEdited) {
            this.editorEdited = true;

            $id('main-note-edit-content').innerHTML = note.content;

            $id('main-note-edit-tags-container').innerHTML = '';
            for (let tag of note.tags) {
                let parent = document.createElement('span') as HTMLSpanElement;
                parent.innerHTML = tag;
                parent.onclick = () => {
                    parent.remove();
                    Editor.options.removeTag(tag);
                }
                $id('main-note-edit-tags-container').appendChild(parent);
            }
        }
    },

    newNote() {
        this.changeState(2);

        this.editorViewed = false;
        this.editorEdited = false;

        (<HTMLInputElement>$id('main-actions-nameInput')).value
            = 'New note';

        $id('main-note-edit-content').innerHTML = '<div><br/></div>';

        $id('main-note-edit-tags-container').innerHTML = '';
    },

    saveNote() {
        if (Left.categories.curr !== null) {
            if (this.state === 1 && Left.notes.curr !== null) {
                let name = (<HTMLInputElement>$id('main-actions-nameInput')).value;
                name = name.trim();

                if (name.length === 0) {
                    Alert.open(
                        'Editing a note',
                        'Name is not valid!'
                    );
                    return;
                }

                let isBusy = Left.categories.curr.notes.some((val: Note) => {
                    if (val.name === name && val !== Left.notes.curr)
                        return true;
                    return false;
                });

                if (isBusy) {
                    Alert.open(
                        'Editing a note',
                        'New name of the note is busy!'
                    );
                    return;
                }

                Left.notes.curr
                    .update(name, $id('main-note-edit-content').innerHTML);

                this.editorViewed = false;
                this.editorEdited = false;
                this.changeState(0);
            } else if (this.state === 2) {
                if (Left.categories.curr === null)
                    return;

                let name = (<HTMLInputElement>$id('main-actions-nameInput')).value;
                name = name.trim();

                if (name.length === 0) {
                    Alert.open(
                        'Creating a note',
                        'Name is not valid!'
                    );
                    return;
                }

                let isBusy = Left.categories.curr.notes.some((val: Note) => {
                    if (val.name === name)
                        return true;
                    return false;
                });

                if (isBusy) {
                    Alert.open(
                        'Creating a note',
                        'Name of the note is busy!'
                    );
                    return;
                }

                let newId;
                if (Left.categories.curr.notes.length === 0)
                    newId = 0;
                else {
                    newId = Math.max.apply(Math, Left.categories.curr.notes.map((note: Note) => {
                        return note.id;
                    }));
                    newId++;
                }

                let today = formatDate(new Date());

                let newNote = new Note(
                    newId,
                    name,
                    $id('main-note-edit-content').innerHTML,
                    false,
                    {
                        active: false
                    },
                    Editor.newTags,
                    today,
                    today
                );

                Left.categories.curr.addNote(newNote);
                Left.notes.add(newNote.leftHTML);

                newNote.choose();
                Main.saveContent();
            }
        }
    },

    options: {
        shown: false,

        toggle(state) {
            if (typeof state !== 'undefined')
                this.shown = state;
            else
                this.shown = !this.shown;

            if (this.shown) {
                $id('main-note-edit-options-toggleImg').setAttribute('name', 'shown');

                $id('main-note-edit-options').style.transform = 'translateY(0px)';

                $id('main-note-edit-buttons').style.bottom = '170px';
            } else {
                $id('main-note-edit-options-toggleImg').setAttribute('name', '');

                $id('main-note-edit-options').style.transform = 'translateY(140px)';

                $id('main-note-edit-buttons').style.bottom = '30px';

                (<HTMLInputElement>document.getElementById('main-note-edit-tags-input')).value = '';
            }
        },

        addTag() {
            let value = (<HTMLInputElement>document.getElementById('main-note-edit-tags-input')).value;
            value = value.trim();

            if (Left.notes.curr === null &&
                Left.notes.curr.tags.indexOf(value) === -1
            ) {
                return; // Already there
            }

            let parent = document.createElement('span') as HTMLSpanElement;
            parent.innerHTML = value;
            parent.onclick = () => {
                this.removeTag(value);
            };
            $id('main-note-edit-tags-container').appendChild(parent);

            if (Editor.state !== 2)
                Left.notes.curr.addTag(value);
            else
                Editor.newTags.push(value);
        },

        removeTag(tagName) {
            if (Left.notes.curr !== null) {
                let it = Left.notes.curr.tags.indexOf(tagName);
                if (it !== -1)
                    Left.notes.curr.removeTag(it);
            }

            if (Editor.state === 2) {
                let it = Editor.newTags.indexOf(tagName);
                if (it !== -1)
                    Editor.newTags.splice(it, 1);
            }

            let children = toArray($id('main-note-edit-tags-container').children);
            for (let tag of children) {
                if (tag.innerHTML === tagName) {
                    tag.remove();
                    break;
                }
            }

        }
    },

    reset() {
        this.state = 0;

        this.editorViewed = false;
        this.editorEdited = false;

        this.options.toggle(false);

        // Hide views
        $id('main-note-notChosen').style.display = 'flex';
        $id('main-note-view').style.display = 'none';
        $id('main-note-edit').style.display = 'none';

        // Clear content
        $id('main-note-view').innerHTML = '';
        $id('main-note-edit-content').innerHTML = '';

        // Hide action tab
        $id('main-actions-state').style.display = 'none';
        $id('main-actions-info').style.display = 'none';
        $id('main-actions-delete').style.display = 'none';

        // Clear action tab
        $id('main-actions-name').style.display = 'none';
        (<HTMLInputElement>$id('main-actions-nameInput')).value = '';

        // Hide footer
        $id('footer-main-p1').style.display = 'none';
        $id('footer-main-p2').style.display = 'none';

        // Clear footer content
        $id('footer-words').innerHTML = '';
        $id('footer-chars').innerHTML = '';
        $id('footer-cDate').innerHTML = '';
        $id('footer-mDate').innerHTML = '';

        // Clear words & character counters
        this.words = 0;
        this.chars = 0;
    },

    saveSelection() {
        let sel = window.getSelection();
        this.cursorPos = sel.getRangeAt(0);
    },

    restoreSelection() {
        if (this.cursorPos !== null) {
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.cursorPos);
        }
    },

    assignListeners() {
        $id('main-actions-state').onclick = () => {
            if (this.state === 0)
                Editor.editNote();
            else
                Editor.displayNote();
        }

        $id('main-actions-info').onclick = () => {
            NoteInfo.open(Left.notes.curr);
        }

        $id('main-actions-delete').onclick = () => {
            Left.categories.curr.promptRemoveNote(Left.notes.curr);
        }

        $id('main-note-edit-options-toggle').onclick = () => {
            Editor.options.toggle();
        }

        $id('main-note-edit-content').addEventListener('blur', () => {
            Editor.saveSelection();
        });

        $id('main-note-edit-cancel').addEventListener('click', () => {
            function ok() {
                if (Left.notes.curr !== null) {
                    $id('main-note-edit-content').innerHTML = Left.notes.curr.content;
                    Editor.displayNote();
                } else {
                    Editor.reset();
                }
            }

            if (Editor.state !== 0) {
                Confirm.open(
                    'Editing',
                    `Are you sure you want to stop editing
                     this note? Any unsaved changes will be lost!`,
                    'Understood',
                    () => {
                        ok();
                    });
            } else {
                ok();
            }

        });

        $id('main-note-edit-save').addEventListener('click', () => {
            Editor.saveNote();
        });

        let tools = toArray($('.main-note-edit-tools-post'));
        for (let tool of tools) {
            tool.addEventListener('click', () => {
                Editor.restoreSelection();

                let cmd = (<HTMLDivElement>tool).dataset.cmd;
                if (cmd !== 'foreColor' &&
                    cmd !== 'backColor' &&
                    cmd !== 'headers' &&
                    cmd !== 'link' &&
                    cmd !== 'formatBlock'
                ) {
                    document.execCommand(cmd);
                } else if (cmd === 'link') {
                    Input.open(
                        'Add a link',
                        '',
                        'Enter URL here...',
                        'Add',
                        (val: string) => {
                            Editor.restoreSelection();
                            document.execCommand('createLink', false, val);
                        }
                    );
                }
            });
        }

        $id('main-note-edit-tags-button').addEventListener('click', () => {
            Editor.options.addTag();
        });
    }
}
