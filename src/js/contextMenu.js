"use strict";
;
const ContextMenu = {
    open(ev) {
        //Prevent default context menu
        ev.preventDefault();
        //Check if right-clicked on context menu
        if (ev.path.indexOf($id('contextMenu')) > -1)
            return;
        //Define context menu object
        const obj = $id('contextMenu');
        // Fill context menu with appropriate data
        for (const el of ev.composedPath()) {
            if (el.id === 'left-categories')
                this.addToContext('categoryList');
            else if (el.id === 'left-notes')
                this.addToContext('noteList');
        }
        let posX;
        let posY;
        //Handle clicking near edge (right)
        if (ev.clientX + obj.offsetWidth > window.innerWidth) {
            let x = ev.clientX - obj.offsetWidth;
            if (x < 0)
                posX = 0;
            else
                posX = x;
        }
        else
            posX = ev.clientX;
        obj.style.left = `${posX}px`;
        //Handle clicking near edge (down)
        if (ev.clientY + obj.offsetHeight > window.innerHeight) {
            let y = ev.clientY - obj.offsetHeight;
            if (y < 0)
                posY = 0;
            else
                posY = y;
        }
        else
            posY = ev.clientY;
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
            // Params === categoryElement
            this.addPost('Choose', 'contextMenu/pointer.png', () => {
                Left.categories.choose(params);
            });
            this.addPost('Edit', 'contextMenu/edit.png', () => {
                CategoryDialog.open(params);
            });
            this.addPost('Delete', 'common/delete_color.png', () => {
                Alert.open('Delete category', `You are about to delete whole category.
                     Doing so will delete <b>ALL</b> notes,
                     that are in this category. Are you sure?`, 'Remove', () => { Left.categories.remove(params); });
            });
        }
        else if (what === 'categoryList') {
            // No params
            this.addPost('Create a category', 'common/add_category_color.png', () => {
                CategoryDialog.open();
            });
        }
        else if (what === 'noteList') {
            // No params
            this.addPost('Create a note', 'common/add_note_color.png', () => {
            });
        }
    },
    addPost(name, imgSrc, callback) {
        let parent = document.createElement('div');
        parent.classList.add('contextMenu-entry');
        parent.onclick = () => { callback(); ContextMenu.close(); };
        let img = new Image();
        img.src = `icons/${imgSrc}`;
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
    checkClose() {
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
