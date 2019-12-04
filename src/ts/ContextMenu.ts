import { IContext } from './interfaces/IContext';

import { Categories } from './Categories';
import { CategoryDialog } from './CategoryDialog';
import { Confirm } from './Confirm';
import { Editor } from './Editor';
import { Left } from './Left';
import { NoteInfo } from './NoteInfo';

import { $id } from './utils';

const pointerSrc = require('../icons/contextMenu/pointer.png');
const editSrc = require('../icons/contextMenu/edit.png');
const deleteColorSrc = require('../icons/common/delete_color.png');
const infoColorSrc = require('../icons/common/info_color.png');
const addCategoryColorSrc = require('../icons/common/add_category_color.png');
const addNoteColorSrc = require('../icons/common/add_note_color.png');

export const ContextMenu: IContext = {
    open(ev) {
        //Prevent default context menu
        ev.preventDefault();

        //Check if right-clicked on context menu
        if ((<any>ev).path.indexOf($id('contextMenu')) > -1)
            return;

        //Define context menu object
        const obj = $id('contextMenu');

        // Fill context menu with appropriate data
        for (const el of ev.composedPath()) {
            if ((<HTMLDivElement>el).id === 'left-categories')
                this.addToContext('categoryList');
            else if ((<HTMLDivElement>el).id === 'left-notes')
                this.addToContext('noteList');
        }

        let posX: number;
        let posY: number;

        //Handle clicking near edge (right)
        if ((<any>ev).clientX + obj.offsetWidth > window.innerWidth) {
            let x = (<any>ev).clientX - obj.offsetWidth;
            if (x < 0)
                posX = 0;
            else
                posX = x;
        } else
            posX = (<any>ev).clientX;
        obj.style.left = `${posX}px`;


        //Handle clicking near edge (down)
        if ((<any>ev).clientY + obj.offsetHeight > window.innerHeight) {
            let y = (<any>ev).clientY - obj.offsetHeight;
            if (y < 0)
                posY = 0;
            else
                posY = y;
        } else
            posY = (<any>ev).clientY;
        obj.style.top = `${posY}px`;

        //Expand
        obj.style.transition = 'transform 0.4s';
        obj.style.transform = 'scale(1, 1)';

        //Set state
        obj.setAttribute('name', 'shown');

        //Focus
        obj.focus();
    },

    addToContext(what, params) {
        if ($id('contextMenu').innerHTML !== '')
            this.addSeparator();

        if (what === 'category') {
            // params === categoryElement
            this.addPost('Choose', pointerSrc, () => {
                params.choose();
            });

            this.addPost('Edit', editSrc, () => {
                CategoryDialog.open(params);
            });

            this.addPost('Delete', deleteColorSrc, () => {
                Confirm.open(
                    'Delete category',
                    `You are about to delete whole category.
                     Doing so will delete <b>ALL</b> notes,
                     that are in this category. Are you sure?`,
                    'Remove',
                    () => { Categories.remove(params); }
                );
            });
        } else if (what === 'note') {
            // params === noteElement
            this.addPost('Choose', pointerSrc, () => {
                params.choose();
            });

            this.addPost('Edit', editSrc, () => {

            });

            this.addPost('Delete', deleteColorSrc, () => {
                Left.categories.curr.promptRemoveNote(params);
            });

            this.addPost('Info', infoColorSrc, () => {
                NoteInfo.open(params);
            });
        } else if (what === 'categoryList') {
            // No params
            this.addPost('Create a category', addCategoryColorSrc, () => {
                CategoryDialog.open();
            });
        } else if (what === 'noteList') {
            // No params
            this.addPost('Create a note', addNoteColorSrc, () => {
                Editor.open(true);
            });
        }
    },

    addPost(name, imgSrc, callback) {
        let parent = document.createElement('div');
        parent.classList.add('contextMenu-entry');
        parent.onclick = () => { callback(); ContextMenu.close(); };
        let img = new Image();
        img.src = `${imgSrc}`;
        parent.appendChild(img);

        let child = document.createElement('span');
        child.innerHTML = name;
        parent.appendChild(child);

        $id('contextMenu').appendChild(parent);
    },

    addSeparator() {
        let parent = document.createElement('div');
        parent.classList.add('contextMenu-separator');
        $id('contextMenu').appendChild(parent);
    },

    assignListeners() {
        document.body.addEventListener('contextmenu', (ev) => {
            ContextMenu.open(ev, 'body');
        });
    },

    close() {
        // Clear
        const obj = $id('contextMenu');
        obj.innerHTML = '';
        obj.setAttribute('name', '');

        //Collapse
        obj.style.transition = 'none';
        obj.style.transform = 'scale(1, 0)';
    },
};

$id('contextMenu').addEventListener('blur', ContextMenu.close);
