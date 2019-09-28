interface IContent {
    initialized: boolean;
    editing: boolean;
    chosenColors: string[];
    chosenColorsCallbacks: any[];

    cursorPos: Range;

    tags: IContentTags;

    init(): void;
    changeState(state?: boolean): void;
    colorCustomColors(): void;

    saveSelection(): void;
    restoreSelection(): void;

    assignListeners(): void;
}

interface IContentTags {
    shown: boolean;

    toggle(state?: boolean): void;
}

const Content: IContent = {
    initialized: false,
    editing: false,
    chosenColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    chosenColorsCallbacks: [null, null, null, null],

    cursorPos: null,

    init() {
        this.initialized = true;

        function initColors(section: string) {
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
                ColorPicker.open((val: string) => {
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
            //FORE

            $id(`main-note-edit-foreColor-c${i + 1}`).dataset.color = this.chosenColors[i];
            $id(`main-note-edit-foreColor-c${i + 1}`).style.background = this.chosenColors[i];
            
            if (this.chosenColorsCallbacks[i] !== null)
                $id(`main-note-edit-foreColor-c${i + 1}`).removeEventListener('click', this.chosenColorsCallbacks[i]);

            this.chosenColorsCallbacks[i] = (ev: MouseEvent) => {
                Content.restoreSelection();
                document.execCommand('foreColor', false, this.chosenColors[i]);
                ev.stopPropagation();
            }
            $id(`main-note-edit-foreColor-c${i + 1}`).addEventListener('click', this.chosenColorsCallbacks[i]);
        
            // BACK

            $id(`main-note-edit-backColor-c${i + 1}`).dataset.color = this.chosenColors[i];
            $id(`main-note-edit-backColor-c${i + 1}`).style.background = this.chosenColors[i];
            
            if (this.chosenColorsCallbacks[i] !== null)
                $id(`main-note-edit-backColor-c${i + 1}`).removeEventListener('click', this.chosenColorsCallbacks[i]);

            this.chosenColorsCallbacks[i] = (ev: MouseEvent) => {
                Content.restoreSelection();
                document.execCommand('backColor', false, this.chosenColors[i]);
                ev.stopPropagation();
            }
            $id(`main-note-edit-backColor-c${i + 1}`).addEventListener('click', this.chosenColorsCallbacks[i]);
        }
    },

    changeState(state) {
        if (typeof state !== 'undefined')
            this.editing = state;
        else
            this.editing = !this.editing;

        if (this.editing) {
            (<HTMLImageElement>$id('main-actions-state'))
                .src = 'icons/common/eye_color.png';

            (<HTMLInputElement>$id('main-actions-nameInput'))
                .disabled = false;

            $id('main-note-view').style.display = 'none';
            $id('main-note-edit').style.display = 'block';
        } else {
            (<HTMLImageElement>$id('main-actions-state'))
                .src = 'icons/common/edit_color.png';

            (<HTMLInputElement>$id('main-actions-nameInput'))
                .disabled = true;

            $id('main-note-view').style.display = 'block';
            $id('main-note-edit').style.display = 'none';
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
            } else {
                $id('main-note-edit-tags-toggleImg').setAttribute('name', '');

                $id('main-note-edit-tags').style.transform = 'translateY(140px)';
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
        }

        $id('main-actions-info').onclick = () => {
            NoteInfo.open(Left.notes.curr);
        }
        
        $id('main-actions-delete').onclick = () => {
            Left.notes.promptRemove(Left.notes.curr);
        }

        $id('main-note-edit-tags-toggle').onclick = () => {
            Content.tags.toggle();
        }

        $id('main-note-edit-content').addEventListener('blur', () => {
            Content.saveSelection();
        });

        let tools = document.getElementsByClassName('main-note-edit-tools-post');
        for (let tool of tools) {
            tool.addEventListener('click', () => {
                Content.restoreSelection();

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
                            Content.restoreSelection();
                            document.execCommand('createLink', false, val);
                        }
                    );
                }
            });
        }
    }
}

