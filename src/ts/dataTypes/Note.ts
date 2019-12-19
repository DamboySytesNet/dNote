import { UserSettings } from './UserSettings';

import { INote } from '../interfaces/INote';
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

export class Note implements INote {
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
    nameBarHTML: HTMLDivElement;
    textBarHTML: HTMLDivElement;
    tagsBarHTML: HTMLDivElement;

    constructor(
        id: number,
        name: string,
        content: string,
        pinned: boolean,
        protection: IProtection,
        tags: string[],
        dateCreated: string,
        dateModified: string
    ) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.pinned = pinned;
        this.protection = protection;
        this.tags = tags;
        this.dateCreated = dateCreated;
        this.dateModified = dateModified;
        this.leftHTML = this.buildLeftHTML();
        this.checkDisplay();
    }

    buildLeftHTML() {
        let parent = document.createElement('div') as HTMLDivElement;
        parent.id = `left-note-${this.id}`;
        parent.classList.add('left-note');
        parent.addEventListener('click', () => {
            this.choose();
        });
        parent.oncontextmenu = () => {
            ContextMenu.addToContext('note', this);
        };

        let child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-note-additions');
        parent.appendChild(child);
        this.topBarHTML = child;
        this.rebuildLeftAdditions();

        child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-note-name');
        let subChild = document.createElement('p') as HTMLParagraphElement;
        this.nameBarHTML = subChild;
        child.appendChild(subChild);
        parent.appendChild(child);

        child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-note-text');
        parent.appendChild(child);
        this.textBarHTML = child;
        this.rebuildLeftContent();

        child = document.createElement('div') as HTMLDivElement;
        child.classList.add('left-note-tags');
        parent.appendChild(child);
        this.tagsBarHTML = child;
        this.rebuildLeftTags();

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
        //          [<span>{tag}</span>]
        //     </div>
        // </div>
    }

    choose() {
        Editor.viewMode
            .open(this)
            .then(() => {
                if (Left.notes.curr !== null) Left.notes.curr.unchoose();

                Left.notes.curr = this;
                this.leftHTML.setAttribute('name', 'chosen');
            })
            .catch();
    }

    unchoose() {
        Left.notes.curr = null;
        this.leftHTML.setAttribute('name', '');
    }

    rebuildLeftAdditions() {
        this.topBarHTML.innerHTML = '';

        if (!UserSettings.appearance.notes.showTop) {
            this.topBarHTML.style.display = 'none';
            return;
        }

        if (!this.pinned && !this.protection.active) {
            this.topBarHTML.style.display = 'none';
            return;
        }

        this.topBarHTML.style.display = 'block';
        let img;
        if (this.pinned) {
            img = new Image();
            img.src = pinColor;
            img.setAttribute('name', 'left');
            img.alt = 'Pinned';
            img.title = 'Pinned';
            this.topBarHTML.appendChild(img);
        }

        if (this.protection.active) {
            img = new Image();
            img.src = lockColor;
            img.setAttribute('name', 'right');
            img.alt = 'Password protected';
            img.title = 'Password protected';
            this.topBarHTML.appendChild(img);
        }
    }

    rebuildLeftContent() {
        this.nameBarHTML.innerHTML = this.name;
        this.textBarHTML.innerHTML = '';

        if (!UserSettings.appearance.notes.showText) {
            this.textBarHTML.style.display = 'none';
            return;
        }

        if (this.content.length === 0 || this.content === '<br>') {
            this.textBarHTML.style.display = 'none';
            return;
        }

        this.textBarHTML.style.display = 'block';

        let tmp = document.createElement('div') as HTMLDivElement;
        tmp.innerHTML = this.content.substr(0, 150);
        this.textBarHTML.innerHTML = getTextFromDOM(tmp);
    }

    rebuildLeftTags() {
        this.tagsBarHTML.innerHTML = '';

        if (!UserSettings.appearance.notes.showTags) {
            this.tagsBarHTML.style.display = 'none';
            return;
        }

        if (this.tags.length === 0) {
            this.tagsBarHTML.style.display = 'none';
            return;
        }

        this.tagsBarHTML.style.display = 'block';

        const limit = this.tags.length > 5 ? 5 : this.tags.length;
        let i = 0;
        for (let tag of this.tags) {
            if (i >= limit) break;

            let tagElement = document.createElement('span') as HTMLSpanElement;
            tagElement.innerHTML = tag;
            tagElement.onclick = ev => {
                ev.stopPropagation();
                Left.search.applySearch(tag);
            };
            this.tagsBarHTML.appendChild(tagElement);
            i++;
        }
    }

    checkDisplay() {
        this.rebuildLeftAdditions();
        this.rebuildLeftContent();
        this.rebuildLeftTags();
    }

    update(name: string, content: string) {
        this.name = name;
        this.content = content;
        this.dateModified = formatDate(new Date());
        this.rebuildLeftContent();
        $id('footer-mDate').innerHTML = this.dateModified;

        Main.saveContent();
    }

    addTag(value: string) {
        this.tags.push(value);
        this.rebuildLeftTags();
        $id('footer-mDate').innerHTML = this.dateModified;

        Main.saveContent();
    }

    removeTag(it: number) {
        this.tags.splice(it, 1);
        this.rebuildLeftTags();
        $id('footer-mDate').innerHTML = this.dateModified;

        Main.saveContent();
    }

    prepRemove() {
        if (Left.notes.curr === this) {
            // No need to ask, as user is sure to delete
            Editor.emptyMode.open(true);
            Left.notes.curr.unchoose();
        }

        this.leftHTML.remove();
    }
}
