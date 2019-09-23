"use strict";
;
const Left = {
    search: {
        shown: false,
        toggle() {
            this.shown = !this.shown;
            if (this.shown) {
                $id('left-actions-searchBar')
                    .style.transform = 'translateY(0%)';
                $id('left-actions-searchBar-input').focus();
            }
            else {
                $id('left-actions-searchBar')
                    .style.transform = 'translateY(-105%)';
                $id('left-actions-searchBar-input').blur();
                $id('left-actions-searchBar-input').value = '';
            }
        },
        clear() {
            $id('left-actions-searchBar-input').value = '';
            $id('left-actions-searchBar-input').focus();
        }
    },
    categories: {
        curr: null,
        build(data) {
            $id('left-categories-content').innerHTML = '';
            if (data.length > 0) {
                $id('left-noCategories').style.display = 'none';
                for (let el of data) {
                    $id('left-categories-content')
                        .appendChild(this.createHTML(el.id, el.name, el.color));
                }
            }
            else {
                $id('left-noCategories').style.display = 'block';
            }
        },
        choose(which) {
            if (Main.data.length > which && which >= 0) {
                this.curr = which;
                Left.notes.build(Main.data[which].notes);
            }
        },
        /**
         * Creates HTML category element
         */
        createHTML(id, name, color) {
            let parent = document.createElement('div');
            parent.id = `left-category-${id}`;
            parent.classList.add('left-category');
            let child = document.createElement('div');
            child.classList.add('left-category-color');
            child.style.background = color;
            parent.appendChild(child);
            child = document.createElement('div');
            child.classList.add('left-category-name');
            let subChild = document.createElement('p');
            subChild.innerHTML = name;
            child.appendChild(subChild);
            parent.appendChild(child);
            return parent;
            // <div id="left-category-${id}" class="left-category">
            //     <div class="left-category-color"></div>
            //     <div class="left-category-name">
            //         <p>TEXT</p>
            //     </div>
            // </div> 
        }
    },
    notes: {
        build(data) {
            $id('left-notes-content').innerHTML = '';
            $id('left-noCategoryChosen').style.display = 'none';
            if (data.length > 0) {
                $id('left-noNotes').style.display = 'none';
                for (let el of data) {
                    $id('left-notes-content')
                        .appendChild(this.createHTML(el.id, el.name, el.pinned, el.protection.protected, el.content.substr(0, 150)));
                }
            }
            else {
                $id('left-noNotes').style.display = 'block';
            }
        },
        choose(which) {
            if (Main.data[Left.categories.curr].notes.length > which && which >= 0) {
            }
        },
        createHTML(id, name, pinned, protected, contentPreview) {
            let parent = document.createElement('div');
            parent.id = `left-note-${id}`;
            parent.classList.add('left-note');
            let child = document.createElement('div');
            child.classList.add('left-note-additions');
            let img;
            if (pinned) {
                img = new Image();
                img.src = 'icons/common/pin_color.png';
                img.setAttribute('name', 'left');
                img.alt = 'Pinned';
                img.title = 'Pinned';
                child.appendChild(img);
            }
            if (protected) {
                img = new Image();
                img.src = 'icons/common/lock_color.png';
                img.setAttribute('name', 'right');
                img.alt = 'Password protected';
                img.title = 'Password protected';
                child.appendChild(img);
            }
            parent.appendChild(child);
            child = document.createElement('div');
            child.classList.add('left-note-name');
            let subChild = document.createElement('p');
            subChild.innerHTML = name;
            child.appendChild(subChild);
            parent.appendChild(child);
            child = document.createElement('div');
            child.classList.add('left-note-text');
            subChild = document.createElement('p');
            subChild.innerHTML = contentPreview;
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
    assignHandlers() {
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
};
//# sourceMappingURL=left.js.map