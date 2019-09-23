interface ILeft {
    search: ILeftSearch;
    categories: ILeftCategories;
    notes: ILeftNotes;

    assignHandlers(): void;
    keyHandler(ev: KeyboardEvent): void
};

interface ILeftSearch {
    shown: boolean;

    toggle(): void;
    clear(): void;
}

interface ILeftCategories {
    curr: ICategory;
    build(data: ICategory[]): void;
    choose(which: ICategory): void;
    createHTML(el: ICategory): HTMLDivElement;
    unselect(): void;
}

interface ILeftNotes {
    noCategory(): void;
    build(data: INote[]): void;
    choose(which: INote): void;
    sort(data: INote[]): void;
    createHTML(el: INote): HTMLDivElement;
}

const Left: ILeft = {
    search: {
        shown: false,

        toggle() {
            this.shown = !this.shown;

            if (this.shown) {
                $id('left-actions-searchBar')
                    .style.transform = 'translateY(0%)';

                $id('left-actions-searchBar-input').focus();
            } else {
                $id('left-actions-searchBar')
                    .style.transform = 'translateY(-105%)';

                $id('left-actions-searchBar-input').blur();
                (<HTMLInputElement>$id('left-actions-searchBar-input')).value = '';
            }
        },

        clear() {
            (<HTMLInputElement>$id('left-actions-searchBar-input')).value = '';
            $id('left-actions-searchBar-input').focus();
        }
    },

    categories: {
        curr: null,

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
            if (which) {
                $id('main-note-notChosen').style.display = 'flex';
                $id('main-note-view').style.display = 'none';
                $id('main-note-edit').style.display = 'none';

                if (this.curr !== null) {
                    this.curr.html.setAttribute('name', '');
                    this.curr.html.style.background = 'initial';
                }

                this.curr = which;
                this.curr.html.setAttribute('name', 'chosen');
                Left.notes.build(which.notes);
            }
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
            //         <p>TEXT</p>
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
            if (which) {
                $id('main-note-notChosen').style.display = 'none';
                $id('main-note-view').style.display = 'block';
                $id('main-note-edit').style.display = 'none';

                $id('main-note-view').innerHTML = which.content;
                $id('main-note-edit').innerHTML = which.content;
            }
        },

        createHTML(el) {
            let parent = document.createElement('div') as HTMLDivElement;
            parent.id = `left-note-${el.id}`;
            parent.classList.add('left-note');
            parent.addEventListener('click', () => {
                Left.notes.choose(el);
            });
                let child = document.createElement('div') as HTMLDivElement;
                child.classList.add('left-note-additions');
                    let img;
                    if (el.pinned) {
                        img = new Image();
                        img.src = 'icons/common/pin_color.png';
                        img.setAttribute('name', 'left');
                        img.alt = 'Pinned';
                        img.title = 'Pinned';
                        child.appendChild(img);
                    }

                    if (el.protection.active) {
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

                let tmp = document.createElement('div') as HTMLDivElement;
                tmp.innerHTML = el.content.substr(0, 150);;

                child = document.createElement('div') as HTMLDivElement;
                child.classList.add('left-note-text');
                    subChild = document.createElement('p') as HTMLParagraphElement;
                    subChild.innerHTML = tmp.textContent;
                    child.appendChild(subChild);
                parent.appendChild(child);


            return parent;

            // <div id="left-note-{id}" class="left-note">
            //     <div class="left-note-additions">
            //         <img src="icons/common/pin_color.png" name="left" alt="Pinned" />
            //         <img src="icons/common/lock_color.png" name="right" alt="Password protected" />
            //     </div>
            //     <div class="left-note-name">
            //         <p>My note my note my note my dNote</p>
            //     </div>
            //     <div class="left-note-text">
            //         <p>
            //             The content of the note that can be
            //             longer than one line or even two
            //             lines or even three but this one is
            //             no visible...
            //         </p>
            //     </div>
            // </div>
        }
    },

    assignHandlers(): void {
        // actions
        $id('left-actions-search')
            .addEventListener('click', () => Left.search.toggle());

        // search
        $id('left-actions-searchBar-clear')
            .addEventListener('click', () => Left.search.clear());

        $id('left-actions-searchBar-close')
            .addEventListener('click', () => Left.search.toggle());
    },

    keyHandler(ev) {
        if (ev.key === 'Escape') {
            //Toggle search
            if (this.search.shown)
                this.search.toggle();
        }
    }
}