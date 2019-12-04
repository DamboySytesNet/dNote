import { UserSettings } from './UserSettings';

import { IProtection } from '../interfaces/IProtection';

import { Confirm } from '../Confirm';
import { ContextMenu } from '../ContextMenu';
import { Editor } from '../Editor';
import { Left } from '../Left';
import { Main } from '../Main';

import { $id, getTextFromDOM, formatDate } from '../utils';

// import * as pinColor from '../../icons/common/pin_color.png';
// import * as lockColor from '../../icons/common/lock_color.png';

const pinColor = require('../../icons/common/pin_color.png');
const lockColor = require('../../icons/common/lock_color.png');

export class Note {
    id: number;
    name: string;
    content: string;
    pinned: boolean;
    protection: IProtection;
    tags: string[];
    dateCreated: string;
    dateModified: string;

    leftHTML: HTMLDivElement;

    topBarHTML: HTMLDivElement;
    textBarHTML: HTMLDivElement;
    tagsBarHTML: HTMLDivElement;

    constructor(id: number,
        name: string,
        content: string,
        pinned: boolean,
        protection: IProtection,
        tags: string[],
        dateCreated: string,
        dateModified: string) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.pinned = pinned;
        this.protection = protection;
        this.tags = tags;
        this.dateCreated = dateCreated;
        this.dateModified = dateModified;
        this.leftHTML = this.buildLeftHTML();
    }

    buildLeftHTML(): HTMLDivElement {
        let parent = document.createElement('div') as HTMLDivElement;
        parent.id = `left-note-${this.id}`;
        parent.classList.add('left-note');
        parent.addEventListener('click', () => {
            if (Editor.state !== 0) {
                Confirm.open(
                    'Editing',
                    `Are you sure you want to stop editing
                     this note? Any unsaved changes will be lost!`,
                    'Understood',
                    () => {
                        //?
                        // Editor.unselect();
                        this.choose();
                    });
            } else {
                this.choose();
            }
        });
        parent.oncontextmenu = () => {
            ContextMenu.addToContext('note', this);
        };
        let child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-note-additions');
        let img;
        if (this.pinned) {
            parent.style.paddingTop = '20px';
            img = new Image();
            img.src = pinColor;
            img.setAttribute('name', 'left');
            img.alt = 'Pinned';
            img.title = 'Pinned';
            child.appendChild(img);
        }

        if (this.protection.active) {
            parent.style.paddingTop = '20px';
            img = new Image();
            img.src = lockColor;
            img.setAttribute('name', 'right');
            img.alt = 'Password protected';
            img.title = 'Password protected';
            child.appendChild(img);
        }
        parent.appendChild(child);
        this.topBarHTML = child;

        child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-note-name');
        let subChild = document.createElement('p') as HTMLParagraphElement;
        subChild.innerHTML = this.name;
        child.appendChild(subChild);
        parent.appendChild(child);


        child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-note-text');
        let tmp = document.createElement('div') as HTMLDivElement;
        tmp.innerHTML = this.content.substr(0, 150);

        subChild = document.createElement('p') as HTMLParagraphElement;
        subChild.innerHTML = getTextFromDOM(tmp);
        child.appendChild(subChild);
        parent.appendChild(child);
        this.textBarHTML = child;

        child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-note-tags');
        const limit = this.tags.length > 5 ? 5 : this.tags.length;
        for (let i = 0; i < limit; i++) {
            parent.style.paddingBottom = '30px';
            let tag = document.createElement('span') as HTMLSpanElement;
            tag.innerHTML = this.tags[i];
            tag.onclick = ev => {
                ev.stopPropagation();
                (<HTMLInputElement>$id('left-notesSearch-input')).value = this.tags[i];
                Left.search.applySearch();
            }
            child.appendChild(tag);
        }
        parent.appendChild(child);
        this.tagsBarHTML = child;


        return parent;

        // <div id="left-note-{id}" class="left-note">
        //     <div class="left-note-additions">
        //         <img src="icons/common/pin_color.png" name="left" alt="Pinned" />
        //         <img src="icons/common/lock_color.png" name="right" alt="Password protected" />
        //     </div>
        //     <div class="left-note-name">
        //         <p>{name}</p>
        //     </div>
        //     <div class="left-note-text">
        //         <p>{content}</p>
        //     </div>
        //     <div class="left-note-tags">
        //          <span>{tag}</span>
        //     </div>
        // </div>
    }

    choose() {
        if (Left.notes.curr !== null)
            Left.notes.curr.unchoose();

        Left.notes.curr = this;
        this.leftHTML.setAttribute('name', 'chosen');

        Editor.open();
    }

    unchoose() {
        Editor.reset();

        Left.notes.curr = null;
        this.leftHTML.setAttribute('name', '');
    }

    checkDisplay() {
        if (UserSettings.appearance.notes.showTop) {
            this.topBarHTML.style.display = 'block';
            if (this.pinned || this.protection.active)
                this.leftHTML.style.paddingTop = '20px';
        } else {
            this.topBarHTML.style.display = 'none';
            this.leftHTML.style.paddingTop = '0px';
        }

        if (UserSettings.appearance.notes.showText)
            this.textBarHTML.style.display = 'block';
        else
            this.textBarHTML.style.display = 'none';

        if (UserSettings.appearance.notes.showTags) {
            if (this.tags.length > 0)
                this.leftHTML.style.paddingBottom = '34px';
            this.tagsBarHTML.style.display = 'block';
        } else {
            this.tagsBarHTML.style.display = 'none';
            this.leftHTML.style.paddingBottom = '8px';
        }
    }

    update(name: string, content: string) {
        this.name = name;
        this.content = content;
        this.dateModified = formatDate(new Date());
        Left.notes.update(this, false);

        Main.saveContent();
    }

    addTag(value: string) {
        this.tags.push(value);
        Left.notes.update(this, true);

        Main.saveContent();
    }

    removeTag(it: number) {
        this.tags.splice(it, 1);
        Left.notes.update(this, true);

        Main.saveContent();
    }

    prepRemove() {
        if (Left.notes.curr === this)
            Left.notes.curr.unchoose();

        this.leftHTML.remove();
    }
};
