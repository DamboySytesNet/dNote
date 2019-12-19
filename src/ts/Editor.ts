const Shell = require('electron').shell;

import { IEditor } from './interfaces/IEditor';
import { INote } from './interfaces/INote';

import { Note } from './dataTypes/Note';

import { Alert } from './Alert';
import { ColorPicker } from './ColorPicker';
import { Confirm } from './Confirm';
import { Input } from './Input';
import { Left } from './Left';
import { Main } from './Main';
import { NoteInfo } from './NoteInfo';

import {
    $,
    $id,
    DefaultColors,
    formatDate,
    toArray,
    getTextFromDOM
} from './utils';

const editColor = require('../icons/common/edit_color.png');
const eyeColor = require('../icons/common/eye_color.png');

export const Editor: IEditor = {
    currentNote: null,
    mode: 'empty',

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
                $id(`main-note-edit-${section}Color-d${i + 1}`).dataset.color =
                    DefaultColors[i];
                $id(
                    `main-note-edit-${section}Color-d${i + 1}`
                ).style.background = DefaultColors[i];

                $id(
                    `main-note-edit-${section}Color-d${i + 1}`
                ).addEventListener('click', ev => {
                    Editor.restoreSelection();
                    document.execCommand(
                        `${section}Color`,
                        false,
                        DefaultColors[i]
                    );
                    ev.stopPropagation();
                });
            }

            $id(`main-note-edit-${section}Color-button`).addEventListener(
                'click',
                () => {
                    ColorPicker.open((val: string) => {
                        Editor.restoreSelection();
                        document.execCommand(`${section}Color`, false, val);
                        Editor.chosenColors.unshift(val);
                        Editor.chosenColors.pop();
                        Editor.colorCustomColors();
                    });
                }
            );
        }

        // Init colors for background and foreground
        initColors('fore');
        initColors('back');

        // Init custom colors for background and foreground
        this.colorCustomColors();

        // Assign header listeners
        const limit = 5;
        for (let i = 1; i <= limit; i++) {
            $id(`main-note-edit-heading-${i}`).addEventListener('click', () => {
                Editor.restoreSelection();
                document.execCommand('formatBlock', false, `H${i}`);
            });
        }

        // Assign 'clear header' listener
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
                $id(`main-note-edit-foreColor-c${i + 1}`).removeEventListener(
                    'click',
                    this.chosenColorsCallbacks[i]
                );

            this.chosenColorsCallbacks[i] = (ev: MouseEvent) => {
                Editor.restoreSelection();
                document.execCommand('foreColor', false, color);
                ev.stopPropagation();
            };
            $id(`main-note-edit-foreColor-c${i + 1}`).addEventListener(
                'click',
                this.chosenColorsCallbacks[i]
            );

            // BACK
            $id(`main-note-edit-backColor-c${i + 1}`).dataset.color = color;
            $id(`main-note-edit-backColor-c${i + 1}`).style.background = color;

            if (this.chosenColorsCallbacks[i] !== null)
                $id(`main-note-edit-backColor-c${i + 1}`).removeEventListener(
                    'click',
                    this.chosenColorsCallbacks[i]
                );

            this.chosenColorsCallbacks[i] = (ev: MouseEvent) => {
                Editor.restoreSelection();
                document.execCommand('backColor', false, color);
                ev.stopPropagation();
            };
            $id(`main-note-edit-backColor-c${i + 1}`).addEventListener(
                'click',
                this.chosenColorsCallbacks[i]
            );
        }
    },

    allowStateChange() {
        return new Promise((revoke, reject) => {
            if (this.mode === 'view' || this.mode === 'empty') {
                revoke();
            } else {
                if (
                    this.mode === 'new' &&
                    (<HTMLInputElement>$id('main-actions-nameInput')).value ===
                        'New note' &&
                    $id('main-note-edit-content').innerHTML === ''
                )
                    revoke();
                else if (
                    this.mode === 'edit' &&
                    (<HTMLInputElement>$id('main-actions-nameInput')).value ===
                        this.currentNote.name &&
                    $id('main-note-edit-content').innerHTML ===
                        this.currentNote.content
                )
                    revoke();
                else {
                    Confirm.open(
                        'Editing',
                        `Are you sure you want to stop editing
                        this note? Any unsaved changes will be lost!`,
                        'Understood',
                        () => {
                            revoke();
                        },
                        () => {
                            reject();
                        }
                    );
                }
            }
        });
    },

    setMode(mode) {
        if (this.mode === mode) return;

        // Hide old mode
        if (this.mode === 'view' && mode !== 'view') this.viewMode.hide();
        else if (this.mode === 'edit' && mode !== 'edit') this.editMode.hide();
        else if (this.mode === 'new' && mode !== 'new') this.newMode.hide();
        else if (this.mode === 'empty' && mode !== 'empty')
            this.emptyMode.hide();

        this.mode = mode;

        // Show new mode
        if (mode === 'view') this.viewMode.show();
        else if (mode === 'edit') this.editMode.show();
        else if (mode === 'new') this.newMode.show();
        else if (mode === 'empty') this.emptyMode.show();
    },

    viewMode: {
        show() {
            $id('main-note-view').style.display = 'block';

            $id('main-actions-state').style.display = 'block';

            (<HTMLImageElement>$id('main-actions-state')).src = editColor;
            $id('main-actions-state').onclick = () => {
                Editor.editMode.open();
            };
            $id('main-actions-name').style.display = 'block';

            $id('main-actions-info').style.display = 'block';
            $id('main-actions-delete').style.display = 'block';

            $id('footer-main-p1').style.display = 'block';
            $id('footer-main-p2').style.display = 'block';
        },

        hide() {
            $id('main-note-view').style.display = 'none';

            $id('main-actions-state').style.display = 'none';
            $id('main-actions-state').onclick = () => {};

            $id('main-actions-name').style.display = 'none';

            $id('main-actions-info').style.display = 'none';
            $id('main-actions-delete').style.display = 'none';

            $id('footer-main-p1').style.display = 'none';
            $id('footer-main-p2').style.display = 'none';
        },

        open(note?: INote) {
            return new Promise((revoke, reject) => {
                if (note === undefined && Editor.currentNote === null) reject();

                Editor.allowStateChange()
                    .then(() => {
                        revoke();

                        Editor.setMode('view');
                        Editor.currentNote =
                            note !== undefined ? note : Editor.currentNote;

                        $id('main-note-view').innerHTML =
                            Editor.currentNote.content;

                        let aTags = toArray(
                            $id('main-note-view').querySelectorAll('a')
                        );

                        for (const a of aTags) {
                            console.log(a);

                            let href = a.href;
                            a.href = '';
                            a.onclick = (event: MouseEvent) => {
                                event.preventDefault();
                                Shell.openExternal(href);
                            };
                        }

                        (<HTMLInputElement>(
                            $id('main-actions-nameInput')
                        )).value = Editor.currentNote.name;

                        Editor.words = getTextFromDOM(
                            $id('main-note-view')
                        ).split(' ').length;
                        Editor.chars = $id('main-note-view').textContent.length;

                        $id('footer-words').innerHTML = Editor.words.toString();
                        $id('footer-chars').innerHTML = Editor.chars.toString();
                        $id('footer-cDate').innerHTML =
                            Editor.currentNote.dateCreated;
                        $id('footer-mDate').innerHTML =
                            Editor.currentNote.dateModified;
                    })
                    .catch(() => {
                        reject();
                    });
            });
        }
    },

    editMode: {
        show() {
            $id('main-note-edit').style.display = 'block';

            $id('main-actions-state').style.display = 'block';
            $id('main-actions-info').style.display = 'block';
            $id('main-actions-delete').style.display = 'block';

            (<HTMLImageElement>$id('main-actions-state')).src = eyeColor;
            $id('main-actions-state').onclick = () => {
                Editor.viewMode.open();
            };
            $id('main-actions-name').style.display = 'block';
            (<HTMLInputElement>$id('main-actions-nameInput')).disabled = false;

            $id('main-note-edit-buttons').style.right = '10px';

            $id('footer-main-p1').style.display = 'block';
            $id('footer-main-p2').style.display = 'block';
        },

        hide() {
            $id('main-note-edit').style.display = 'none';

            $id('main-actions-state').style.display = 'none';
            $id('main-actions-info').style.display = 'none';
            $id('main-actions-delete').style.display = 'none';

            $id('main-actions-name').style.display = 'none';
            (<HTMLInputElement>$id('main-actions-nameInput')).disabled = true;
            $id('main-actions-state').onclick = () => {};

            $id('main-note-edit-buttons').style.right = '-170px';

            $id('footer-main-p1').style.display = 'none';
            $id('footer-main-p2').style.display = 'none';
        },

        open(note: INote) {
            return new Promise((revoke, reject) => {
                if (note === undefined && Editor.currentNote === null) reject();

                Editor.allowStateChange()
                    .then(() => {
                        revoke();

                        Editor.setMode('edit');
                        Editor.currentNote =
                            note !== undefined ? note : Editor.currentNote;

                        (<HTMLInputElement>(
                            $id('main-actions-nameInput')
                        )).value = Editor.currentNote.name;

                        $id('main-note-edit-content').innerHTML =
                            Editor.currentNote.content;

                        $id('main-note-edit-tags-container').innerHTML = '';
                        for (let tag of Editor.currentNote.tags) {
                            let parent = document.createElement(
                                'span'
                            ) as HTMLSpanElement;
                            parent.innerHTML = tag;
                            parent.onclick = () => {
                                parent.remove();
                                Editor.options.removeTag(tag);
                            };
                            $id('main-note-edit-tags-container').appendChild(
                                parent
                            );
                        }
                    })
                    .catch(() => {
                        reject();
                    });
            });
        }
    },

    newMode: {
        show() {
            $id('main-note-edit').style.display = 'block';

            $id('main-actions-name').style.display = 'block';
            $id('main-actions-name').setAttribute('name', 'full');
            (<HTMLInputElement>$id('main-actions-nameInput')).disabled = false;

            $id('main-note-edit-buttons').style.right = '10px';
        },

        hide() {
            $id('main-note-edit').style.display = 'none';

            $id('main-actions-name').style.display = 'none';
            $id('main-actions-name').setAttribute('name', '');
            (<HTMLInputElement>$id('main-actions-nameInput')).disabled = true;

            $id('main-note-edit-buttons').style.right = '-170px';
        },

        open() {
            return new Promise((revoke, reject) => {
                Editor.allowStateChange()
                    .then(() => {
                        revoke();

                        Editor.setMode('new');
                        (<HTMLInputElement>(
                            $id('main-actions-nameInput')
                        )).value = 'New note';

                        $id('main-note-edit-content').innerHTML = '';
                        // '<div><br/></div>';

                        $id('main-note-edit-tags-container').innerHTML = '';
                    })
                    .catch(() => {
                        reject();
                    });
            });
        }
    },

    emptyMode: {
        show() {
            $id('main-note-notChosen').style.display = 'flex';
        },

        hide() {
            $id('main-note-notChosen').style.display = 'none';
        },

        open(force?: boolean) {
            if (force) Editor.setMode('empty');

            return new Promise((revoke, reject) => {
                if (!force) {
                    Editor.allowStateChange()
                        .then(() => {
                            Editor.setMode('empty');
                            revoke();
                        })
                        .catch(() => {
                            reject();
                        });
                } else revoke();
            });
        }
    },

    saveNote() {
        if (this.mode === 'new') this.createNote();
        else if (this.mode === 'edit') this.editNote();
    },

    createNote() {
        if (Left.categories.curr === null) return;

        let name = (<HTMLInputElement>$id('main-actions-nameInput')).value;
        name = name.trim();

        if (name.length === 0) {
            Alert.open('Creating a note', 'Name is not valid!');
            return;
        }

        let isBusy = Left.categories.curr.notes.some((val: INote) => {
            if (val.name === name) return true;
            return false;
        });

        if (isBusy) {
            Alert.open('Creating a note', 'Name of the note is busy!');
            return;
        }

        let newId;
        if (Left.categories.curr.notes.length === 0) newId = 1;
        else {
            newId = Math.max.apply(
                Math,
                Left.categories.curr.notes.map((note: INote) => {
                    return note.id;
                })
            );
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
        Editor.emptyMode.open(true);

        newNote.choose();
        Main.saveContent();
    },

    editNote() {
        if (this.currentNote === null) return;

        let name = (<HTMLInputElement>$id('main-actions-nameInput')).value;
        name = name.trim();

        if (name.length === 0) {
            Alert.open('Editing a note', 'Name is not valid!');
            return;
        }

        let isBusy = Left.categories.curr.notes.some((val: INote) => {
            if (val.name === name && val !== Left.notes.curr) return true;
            return false;
        });

        if (isBusy) {
            Alert.open('Editing a note', 'New name of the note is busy!');
            return;
        }

        Left.notes.curr.update(name, $id('main-note-edit-content').innerHTML);

        Editor.emptyMode.open(true);
        this.viewMode.open();
    },

    options: {
        shown: false,

        toggle(state) {
            if (typeof state !== 'undefined') this.shown = state;
            else this.shown = !this.shown;

            if (this.shown) {
                $id('main-note-edit-options-toggleImg').setAttribute(
                    'name',
                    'shown'
                );

                $id('main-note-edit-options').style.transform =
                    'translateY(0px)';

                $id('main-note-edit-buttons').style.bottom = '205px';
            } else {
                $id('main-note-edit-options-toggleImg').setAttribute(
                    'name',
                    ''
                );

                $id('main-note-edit-options').style.transform =
                    'translateY(175px)';

                $id('main-note-edit-buttons').style.bottom = '30px';

                (<HTMLInputElement>(
                    document.getElementById('main-note-edit-tags-input')
                )).value = '';
            }
        },

        addTag() {
            $id('main-note-edit-tags-msg').innerHTML = '';
            let value = (<HTMLInputElement>(
                document.getElementById('main-note-edit-tags-input')
            )).value;
            value = value.trim();

            (<HTMLInputElement>(
                document.getElementById('main-note-edit-tags-input')
            )).select();

            if (value.length === 0) return;

            if (
                Left.notes.curr !== null &&
                Left.notes.curr.tags.indexOf(value) > -1
            ) {
                $id('main-note-edit-tags-msg').innerHTML =
                    'Given tag is already on the list';
                return; // Tag is already there
            }

            if (Editor.mode === 'new' && Editor.newTags.indexOf(value) > -1) {
                $id('main-note-edit-tags-msg').innerHTML =
                    'Given tag is already on the list';
                return; // Tag is already there
            }

            (<HTMLInputElement>(
                document.getElementById('main-note-edit-tags-input')
            )).value = '';

            let parent = document.createElement('span') as HTMLSpanElement;
            parent.innerHTML = value;
            parent.onclick = () => {
                this.removeTag(value);
            };
            $id('main-note-edit-tags-container').appendChild(parent);

            if (Editor.mode !== 'new') Left.notes.curr.addTag(value);
            else Editor.newTags.push(value);
        },

        removeTag(tagName) {
            if (Left.notes.curr !== null) {
                let it = Left.notes.curr.tags.indexOf(tagName);
                if (it !== -1) Left.notes.curr.removeTag(it);
            } else if (Editor.mode === 'new') {
                let it = Editor.newTags.indexOf(tagName);
                if (it !== -1) Editor.newTags.splice(it, 1);
            }

            let children = toArray(
                $id('main-note-edit-tags-container').children
            );
            for (let tag of children) {
                if (tag.innerHTML === tagName) {
                    tag.remove();
                    break;
                }
            }
        }
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
        $id('main-actions-info').onclick = () => {
            NoteInfo.open(Left.notes.curr);
        };

        $id('main-actions-delete').onclick = () => {
            Left.categories.curr.promptRemoveNote(Left.notes.curr);
        };

        $id('main-note-edit-options-toggle').onclick = () => {
            Editor.options.toggle();
        };

        $id('main-note-edit-content').addEventListener('blur', () => {
            Editor.saveSelection();
        });

        $id('main-note-edit-cancel').addEventListener('click', () => {
            Editor.viewMode.open().catch();
        });

        $id('main-note-edit-save').addEventListener('click', () => {
            Editor.saveNote();
        });

        let tools = toArray($('.main-note-edit-tools-post'));
        for (let tool of tools) {
            tool.addEventListener('click', () => {
                Editor.restoreSelection();

                let cmd = (<HTMLDivElement>tool).dataset.cmd;
                if (
                    cmd !== 'foreColor' &&
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
};
