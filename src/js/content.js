"use strict";
const Content = {
    initialized: false,
    editing: false,
    creating: false,
    chosenColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    chosenColorsCallbacks: [null, null, null, null],
    cursorPos: null,
    init() {
        this.initialized = true;
        function initColors(section) {
            const limit = 8; // two rows, 4 each
            for (let i = 0; i < limit; i++) {
                $id(`main-note-edit-${section}Color-d${i + 1}`).dataset.color = DefaultColors[i];
                $id(`main-note-edit-${section}Color-d${i + 1}`).style.background = DefaultColors[i];
                $id(`main-note-edit-${section}Color-d${i + 1}`).addEventListener('click', ev => {
                    Content.restoreSelection();
                    document.execCommand(`${section}Color`, false, DefaultColors[i]);
                    ev.stopPropagation();
                });
            }
            $id(`main-note-edit-${section}Color-button`).addEventListener('click', () => {
                ColorPicker.open((val) => {
                    Content.restoreSelection();
                    document.execCommand(`${section}Color`, false, val);
                    Content.chosenColors.unshift(val);
                    Content.chosenColors.pop();
                    Content.colorCustomColors();
                });
            });
        }
        initColors('fore');
        initColors('back');
        this.colorCustomColors();
        const limit = 5;
        for (let i = 1; i <= limit; i++) {
            $id(`main-note-edit-heading-${i}`).addEventListener('click', () => {
                Content.restoreSelection();
                document.execCommand('formatBlock', false, `H${i}`);
            });
        }
        $id('main-note-edit-heading-0').addEventListener('click', () => {
            Content.restoreSelection();
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
            this.chosenColorsCallbacks[i] = (ev) => {
                Content.restoreSelection();
                document.execCommand('foreColor', false, color);
                ev.stopPropagation();
            };
            $id(`main-note-edit-foreColor-c${i + 1}`).addEventListener('click', this.chosenColorsCallbacks[i]);
            // BACK
            $id(`main-note-edit-backColor-c${i + 1}`).dataset.color = color;
            $id(`main-note-edit-backColor-c${i + 1}`).style.background = color;
            if (this.chosenColorsCallbacks[i] !== null)
                $id(`main-note-edit-backColor-c${i + 1}`).removeEventListener('click', this.chosenColorsCallbacks[i]);
            this.chosenColorsCallbacks[i] = (ev) => {
                Content.restoreSelection();
                document.execCommand('backColor', false, color);
                ev.stopPropagation();
            };
            $id(`main-note-edit-backColor-c${i + 1}`).addEventListener('click', this.chosenColorsCallbacks[i]);
        }
    },
    create() {
        if (Left.notes.curr !== null)
            Left.notes.curr.html.setAttribute('name', '');
        Content.changeState(true);
        Left.notes.curr = null;
        this.creating = true;
        $id('main-note-notChosen').style.display = 'none';
        $id('main-actions-name').style.display = 'block';
        $id('main-note-view').innerHTML = '';
        $id('main-note-edit-content').innerHTML = '<div><br/></div>';
        $id('footer-main-p1').style.display = 'none';
        $id('footer-main-p2').style.display = 'none';
        Left.notes.words = 0;
        Left.notes.chars = 0;
        $id('main-actions-name').setAttribute('name', 'full');
        $id('main-actions-nameInput')
            .value = 'Untitled';
        $id('footer-words').innerHTML = '';
        $id('footer-chars').innerHTML = '';
        $id('footer-cDate').innerHTML = '';
        $id('footer-mDate').innerHTML = '';
        $id('main-actions-state').style.display = 'none';
        $id('main-actions-info').style.display = 'none';
        $id('main-actions-delete').style.display = 'none';
    },
    check() {
        if (Left.categories.curr !== null) {
            if (this.creating) {
                let name = $id('main-actions-nameInput').value;
                name = name.trim();
                if (name.length === 0) {
                    Alert.open('Creating a note', 'Name is not valid!');
                    return;
                }
                let isBusy = Left.categories.curr.notes.some(val => {
                    if (val.name === name)
                        return true;
                    return false;
                });
                if (isBusy) {
                    Alert.open('Creating a note', 'Name of the note is busy!');
                    return;
                }
                let lastId = Math.max.apply(Math, Left.categories.curr.notes.map(note => {
                    return note.id;
                }));
                let today = formatDate(new Date());
                let newNote = {
                    id: lastId + 1,
                    name: name,
                    content: $id('main-note-edit-content').innerHTML,
                    pinned: false,
                    protection: {
                        active: false
                    },
                    tags: [],
                    dateCreated: today,
                    dateModified: today,
                    html: null
                };
                newNote.html = Left.notes.createHTML(newNote);
                Left.notes.add(newNote);
                this.unselect();
                Left.notes.choose(newNote);
            }
            else if (Left.notes.curr !== null) {
                let name = $id('main-actions-nameInput').value;
                name = name.trim();
                if (name.length === 0) {
                    Alert.open('Editing a note', 'Name is not valid!');
                    return;
                }
                let isBusy = Left.categories.curr.notes.some(val => {
                    if (val.name === name && val !== Left.notes.curr)
                        return true;
                    return false;
                });
                if (isBusy) {
                    Alert.open('Creating a note', 'Name of the note is busy!');
                    return;
                }
                Left.notes.curr.name = name;
                Left.notes.curr.content = $id('main-note-edit-content').innerHTML;
                Left.notes.curr.dateModified = formatDate(new Date());
                Left.notes.edit(Left.notes.curr);
                this.changeState(false);
            }
        }
    },
    unselect() {
        if (this.creating) {
            $id('main-note-notChosen').style.display = 'flex';
            $id('main-actions-nameInput').value = '';
        }
        Content.changeState(false);
        this.editing = false;
        this.creating = false;
    },
    changeState(state) {
        if (typeof state !== 'undefined')
            this.editing = state;
        else
            this.editing = !this.editing;
        if (this.editing) {
            $id('main-actions-state')
                .src = 'icons/common/eye_color.png';
            $id('main-actions-nameInput')
                .disabled = false;
            $id('main-note-view').style.display = 'none';
            $id('main-note-edit').style.display = 'block';
            $id('main-note-edit-buttons').style.right = '0px';
        }
        else {
            $id('main-actions-state')
                .src = 'icons/common/edit_color.png';
            $id('main-actions-nameInput')
                .disabled = true;
            $id('main-note-view').style.display = 'block';
            $id('main-note-edit').style.display = 'none';
            $id('main-note-edit-buttons').style.right = '-170px';
        }
    },
    tags: {
        shown: false,
        toggle(state) {
            if (typeof state !== 'undefined')
                this.shown = state;
            else
                this.shown = !this.shown;
            if (this.shown) {
                $id('main-note-edit-tags-toggleImg').setAttribute('name', 'shown');
                $id('main-note-edit-tags').style.transform = 'translateY(0px)';
                $id('main-note-edit-buttons').style.bottom = '170px';
            }
            else {
                $id('main-note-edit-tags-toggleImg').setAttribute('name', '');
                $id('main-note-edit-tags').style.transform = 'translateY(140px)';
                $id('main-note-edit-buttons').style.bottom = '30px';
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
        $id('main-actions-state').onclick = () => {
            Content.changeState();
        };
        $id('main-actions-info').onclick = () => {
            NoteInfo.open(Left.notes.curr);
        };
        $id('main-actions-delete').onclick = () => {
            Left.notes.promptRemove(Left.notes.curr);
        };
        $id('main-note-edit-tags-toggle').onclick = () => {
            Content.tags.toggle();
        };
        $id('main-note-edit-content').addEventListener('blur', () => {
            Content.saveSelection();
        });
        $id('main-note-edit-cancel').addEventListener('click', () => {
            Content.unselect();
        });
        $id('main-note-edit-save').addEventListener('click', () => {
            Content.check();
        });
        let tools = document.getElementsByClassName('main-note-edit-tools-post');
        for (let tool of tools) {
            tool.addEventListener('click', () => {
                Content.restoreSelection();
                let cmd = tool.dataset.cmd;
                if (cmd !== 'foreColor' &&
                    cmd !== 'backColor' &&
                    cmd !== 'headers' &&
                    cmd !== 'link' &&
                    cmd !== 'formatBlock') {
                    document.execCommand(cmd);
                }
                else if (cmd === 'link') {
                    Input.open('Add a link', '', 'Enter URL here...', 'Add', (val) => {
                        Content.restoreSelection();
                        document.execCommand('createLink', false, val);
                    });
                }
            });
        }
    }
};
