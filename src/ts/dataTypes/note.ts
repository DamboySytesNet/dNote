interface IProtection {
    active: boolean;
}

class Note {
    id: number;
    name: string;
    content: string;
    pinned: boolean;
    protection: IProtection;
    tags: string[];
    dateCreated: string;
    dateModified: string;

    leftHTML: HTMLDivElement;

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
                    img.src = 'icons/common/pin_color.png';
                    img.setAttribute('name', 'left');
                    img.alt = 'Pinned';
                    img.title = 'Pinned';
                    child.appendChild(img);
                }

                if (this.protection.active) {
                    parent.style.paddingTop = '20px';
                    img = new Image();
                    img.src = 'icons/common/lock_color.png';
                    img.setAttribute('name', 'right');
                    img.alt = 'Password protected';
                    img.title = 'Password protected';
                    child.appendChild(img);
                }
            parent.appendChild(child);

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