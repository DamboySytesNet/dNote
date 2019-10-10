interface ILeft {
    search: ILeftSearch;
    categories: ILeftCategories;
    notes: ILeftNotes;

    assignListeners(): void;
    keyHandler(ev: KeyboardEvent): void
};

interface ILeftSearch {
    applySearch(): void;
    clear(): void;
}

interface ILeftCategories {
    curr: ICategory;
    shown: boolean;

    toggle(): void;
    build(data: ICategory[]): void;
    add(obj: ICategory): void;
    edit(obj: ICategory, name: string, color: string): void;
    remove(obj: ICategory): void;
    choose(which: ICategory): void;
    createHTML(el: ICategory): HTMLDivElement;
    unselect(): void;
}

interface ILeftNotes {
    curr: INote;
    words: number;
    chars: number;

    noCategory(): void;
    build(data: INote[]): void;
    add(obj: INote): void;
    edit(note: INote): void;
    promptRemove(obj: INote): void;
    remove(obj: INote): void;
    choose(which: INote): void;
    sort(data: INote[]): void;
    createHTML(el: INote): HTMLDivElement;
    unselect(): void;
}

const Left: ILeft = {
    search: {
        applySearch() {
            const value = (<HTMLInputElement>$id('left-notesSearch-input')).value;


            for (let el of Left.categories.curr.notes) {
                if (value === '') {
                    el.html.style.display = 'block';
                    continue;
                }

                let div = document.createElement('div');
                div.innerHTML = el.content;
                if (el.name.indexOf(value) > -1 ||
                    div.textContent.indexOf(value) > -1 || 
                    el.tags.indexOf(value) > -1)
                        el.html.style.display = 'block';
                else
                    el.html.style.display = 'none';
            }
        },

        clear() {
            (<HTMLInputElement>$id('left-notesSearch-input')).value = '';
            this.applySearch();
            $id('left-notesSearch-input').focus();
        }
    },

    categories: {
        curr: null,
        shown: true,

        toggle() {
            this.shown = !this.shown;

            if (this.shown) {
                $id('left-categories').style.width = '240px';
                $id('left-notes').style.width = 'calc(100% - 241px)';
            } else {
                $id('left-categories').style.width = '0px';
                $id('left-notes').style.width = 'calc(100% - 1px)';
            }
        },

        build(data) {
            $id('left-categories-content').innerHTML = '';

            if (data.length > 0) {
                $id('left-noCategories').style.display = 'none';

                for(let el of data) {
                    el.html = this.createHTML(el);

                    $id('left-categories-content')
                        .appendChild(el.html);
                }
            } else {
                $id('left-noCategories').style.display = 'block';
            }
        },

        choose(which) {
            function ok() {
                if (which) {
                    $id('main-note-notChosen').style.display = 'flex';
                    $id('main-note-view').style.display = 'none';
                    $id('main-note-edit').style.display = 'none';

                    if (Left.categories.curr !== null) {
                        Left.categories.curr.html.setAttribute('name', '');
                        Left.categories.curr.html.style.background = 'initial';
                    }

                    if (Left.notes.curr !== null)
                        Left.notes.unselect();

                    Left.categories.curr = which;
                    Left.categories.curr.html.setAttribute('name', 'chosen');
                    Left.notes.build(which.notes);
                }
            }

            if (Content.editing || Content.creating) {
                Confirm.open(
                    'Editing',
                    `Are you sure you want to stop editing
                     this note? Any unsaved changes will be lost!`,
                    'Understood',
                    () => {
                        Content.unselect();
                        ok();
                    });
            } else {
                ok();
            }
        },

        add(obj) {
            Main.data.push(obj);

            Main.saveContent();

            $id('left-categories-content')
                .appendChild(obj.html);
        },

        edit(obj, name, color) {
            obj.name = name;
            obj.color = color;

            (<HTMLDivElement>obj.html.children[0]).style.background = color;
            (<HTMLDivElement>obj.html.children[1]).style.background = color;
            obj.html.children[2].children[0].innerHTML = name;

            Main.saveContent();
        },

        remove(el) {
            if (this.curr !== null) {
                if (this.curr.notes.indexOf(Left.notes.curr) > -1)
                    Left.notes.unselect();
            }

            if (el === this.curr)
                this.unselect();

            Main.data.some((val, it) => {
                if (val === el) {
                    Main.data.splice(it, 1);
                    return true;
                }
                return false;
            });

            el.html.remove();
            Main.saveContent();
        },

        /**
         * Creates HTML category element
         */
        createHTML(el) {
            let parent = document.createElement('div') as HTMLDivElement;
            parent.id = `left-category-${el.id}`;
            parent.classList.add('left-category');
            parent.onclick = () => {
                Left.categories.choose(el);
            }
            parent.oncontextmenu = () => {
                ContextMenu.addToContext('category', el);
            }
                let child = document.createElement('div') as HTMLDivElement;
                child.classList.add('left-category-color');
                child.style.background = el.color;
                parent.appendChild(child);

                child = document.createElement('div') as HTMLDivElement;
                child.classList.add('left-category-background');
                child.style.background = el.color;
                parent.appendChild(child);

                child = document.createElement('div') as HTMLDivElement;
                child.classList.add('left-category-name');
                    let subChild = document.createElement('p') as HTMLParagraphElement;
                    subChild.innerHTML = el.name;
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
        },

        unselect() {
            if (this.curr !== null) {
                this.curr.html.setAttribute('name', '');
                this.curr.html.style.background = 'initial';
                this.curr = null;
                Left.notes.noCategory();
            }
        }
    },

    notes: {
        curr: null,
        words: 0,
        chars: 0,

        noCategory() {
            $id('left-notes-content').innerHTML = '';
            $id('left-noCategoryChosen').style.display = 'block';
            $id('left-noNotes').style.display = 'none';
        },

        build(data) {
            $id('left-notes-content').innerHTML = '';
            $id('left-noCategoryChosen').style.display = 'none';

            if (data.length > 0) {
                $id('left-noNotes').style.display = 'none';

                this.sort(data);

                for(let el of data) {
                    el.html = this.createHTML(el);

                    $id('left-notes-content')
                        .appendChild(el.html);
                }
            } else {
                $id('left-noNotes').style.display = 'block';
            }
        },

        add(note) {
            if (Left.categories.curr !== null) {
                Left.categories.curr.notes.push(note);

                Main.saveContent();

                $id('left-notes-content')
                    .appendChild(note.html);
            }
        },
        
        edit(note) {
            note.html.children[0].innerHTML = '';

            let img;
            if (note.pinned) {
                note.html.style.paddingTop = '20px';
                img = new Image();
                img.src = 'icons/common/pin_color.png';
                img.setAttribute('name', 'left');
                img.alt = 'Pinned';
                img.title = 'Pinned';
                note.html.children[0].appendChild(img);
            }

            if (note.protection.active) {
                note.html.style.paddingTop = '20px';
                img = new Image();
                img.src = 'icons/common/lock_color.png';
                img.setAttribute('name', 'right');
                img.alt = 'Password protected';
                img.title = 'Password protected';
                note.html.children[0].appendChild(img);
            }

            note.html.children[1].children[0].innerHTML = note.name;

            let tmp = document.createElement('div') as HTMLDivElement;
            tmp.innerHTML = note.content.substr(0, 150);
            
            note.html.children[2].children[0].innerHTML = getTextFromDOM(tmp);

            note.html.children[3].innerHTML = '';
            const limit = note.tags.length > 5 ? 5 : note.tags.length;
            for (let i = 0; i < limit; i++) {
                note.html.style.paddingBottom = '30px';
                let tag = document.createElement('span') as HTMLSpanElement;
                tag.innerHTML = note.tags[i];
                tag.onclick = ev => {
                    ev.stopPropagation();
                    (<HTMLInputElement>$id('left-notesSearch-input')).value = note.tags[i];
                    Left.search.applySearch();
                }
                note.html.children[3].appendChild(tag);
            }

            $id('footer-mDate').innerHTML = note.dateModified;

            $id('main-note-view').innerHTML         = note.content;
            $id('main-note-edit-content').innerHTML = note.content;

            Main.saveContent();
        },

        promptRemove(el) {
            Confirm.open(
                'Delete a note',
                `You are about to delete a note.
                 There is no going back after
                 confirmation. Are you sure?`,
                'Remove',
                () => {
                    Left.notes.remove(el);
                }
            );
        },

        remove(el) {
            if (el !== null && Left.categories.curr !== null) {
                if (Left.notes.curr === el)
                    Left.notes.unselect();
                    
                Left.categories.curr.notes.some((val, it) => {
                    if (val === el) {
                        Left.categories.curr.notes.splice(it, 1);
                        return true;
                    }
                    return false;
                });

                el.html.remove();
                Main.saveContent();
            }
        },

        sort(data) {
            data.sort((a, b) => {
                if (a.pinned === b.pinned) {
                    return a.name.localeCompare(b.name);
                } else if (a.pinned)
                    return -1;
                else
                    return 1;
            });
        },

        choose(which) {
            function ok() {
                if (which) {
                    if (Left.notes.curr !== null)
                        Left.notes.curr.html.setAttribute('name', '');

                    Content.changeState(false);

                    Left.notes.curr = which;
                    Left.notes.curr.html.setAttribute('name', 'chosen');

                    $id('main-note-notChosen').style.display = 'none';
                    $id('main-actions-name').style.display = 'block';

                    $id('main-note-view').innerHTML = which.content;
                    $id('main-note-edit-content').innerHTML = which.content;

                    $id('footer-main-p1').style.display = 'block';
                    $id('footer-main-p2').style.display = 'block';

                    Left.notes.words = getTextFromDOM($id('main-note-view')).split(' ').length;
                    Left.notes.chars = $id('main-note-view').textContent.length;

                    $id('main-actions-name').setAttribute('name', '');

                    (<HTMLInputElement>$id('main-actions-nameInput')).value 
                        = which.name;

                    $id('main-note-edit-tags-container').innerHTML = '';
                    for (let tag of which.tags) {
                        let parent = document.createElement('span') as HTMLSpanElement;
                        parent.innerHTML = tag;
                        parent.onclick = () => {
                            parent.remove();
                            Content.options.removeTag(tag);
                        }
                        $id('main-note-edit-tags-container').appendChild(parent);
                    }
                    
                    $id('footer-words').innerHTML = Left.notes.words.toString();
                    $id('footer-chars').innerHTML = Left.notes.chars.toString();
                    $id('footer-cDate').innerHTML = which.dateCreated;
                    $id('footer-mDate').innerHTML = which.dateModified;

                    $id('main-actions-state').style.display  = 'block';
                    $id('main-actions-info').style.display   = 'block';
                    $id('main-actions-delete').style.display = 'block';
                }
            }

            if (Content.editing || Content.creating) {
                Confirm.open(
                    'Editing',
                    `Are you sure you want to stop editing
                     this note? Any unsaved changes will be lost!`,
                    'Understood',
                    () => { 
                        Content.unselect();
                        ok();
                    });
            } else {
                ok();
            }
        },

        unselect() {
            if (this.curr !== null) {
                this.curr = null;
                Content.changeState(false);

                $id('main-note-notChosen').style.display = 'flex';
                $id('main-note-view').style.display = 'none';
                $id('main-actions-name').style.display = 'none';
                (<HTMLInputElement>$id('main-actions-nameInput')).value = '';

                $id('main-note-view').innerHTML = '';
                
                $id('footer-main-p1').style.display = 'none';
                $id('footer-main-p2').style.display = 'none';

                $id('footer-words').innerHTML = '';
                $id('footer-chars').innerHTML = '';
                $id('footer-cDate').innerHTML = '';
                $id('footer-mDate').innerHTML = '';

                this.words = 0;
                this.chars = 0;

                $id('main-actions-state').style.display  = 'none';
                $id('main-actions-info').style.display   = 'none';
                $id('main-actions-delete').style.display = 'none';
            }
        },

        createHTML(el) {
            let parent = document.createElement('div') as HTMLDivElement;
            parent.id = `left-note-${el.id}`;
            parent.classList.add('left-note');
            parent.addEventListener('click', () => {
                Left.notes.choose(el);
            });
            parent.oncontextmenu = () => {
                ContextMenu.addToContext('note', el);
            };
                let child = document.createElement('div') as HTMLDivElement;
                child.classList.add('left-note-additions');
                    let img;
                    if (el.pinned) {
                        parent.style.paddingTop = '20px';
                        img = new Image();
                        img.src = 'icons/common/pin_color.png';
                        img.setAttribute('name', 'left');
                        img.alt = 'Pinned';
                        img.title = 'Pinned';
                        child.appendChild(img);
                    }

                    if (el.protection.active) {
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
                    subChild.innerHTML = el.name;
                    child.appendChild(subChild);
                parent.appendChild(child);


                child = document.createElement('div') as HTMLDivElement;
                child.classList.add('left-note-text');
                    let tmp = document.createElement('div') as HTMLDivElement;
                    tmp.innerHTML = el.content.substr(0, 150);

                    subChild = document.createElement('p') as HTMLParagraphElement;
                    subChild.innerHTML = getTextFromDOM(tmp);
                    child.appendChild(subChild);
                parent.appendChild(child);

                child = document.createElement('div') as HTMLDivElement;
                child.classList.add('left-note-tags');
                    const limit = el.tags.length > 5 ? 5 : el.tags.length;
                    for (let i = 0; i < limit; i++) {
                        parent.style.paddingBottom = '30px';
                        let tag = document.createElement('span') as HTMLSpanElement;
                        tag.innerHTML = el.tags[i];
                        tag.onclick = ev => {
                            ev.stopPropagation();
                            (<HTMLInputElement>$id('left-notesSearch-input')).value = el.tags[i];
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
            //     <div>
            //          <span>{tag}</span>
            //     </div>
            // </div>
        }
    },

    assignListeners(): void {
        $id('left-notesSearch-input')
            .addEventListener('keyup', () => Left.search.applySearch());

        $id('left-actions-addNote')
            .addEventListener('click', () => Content.create());

        $id('left-notes-add')
            .addEventListener('click', () => Content.create());
            
        $id('left-notesSearch-clear')
            .addEventListener('click', () => Left.search.clear());

        $id('left-actions-menu')
            .addEventListener('click', () => Left.categories.toggle());
    },

    keyHandler(ev) {
        if (ev.key === 'Escape') {
            
        }
    }
}