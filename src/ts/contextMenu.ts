interface IContext {
    open(ev: MouseEvent, which: string): void;
    checkClose(): void;
    close(): void;

    addToContext(what: string, params?: any): void;
    addPost(name: string, imgSrc: string, callback: any): void;
    addSeparator(): void;
    assignListeners(): void;
};

const ContextMenu: IContext = {
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
        
        let posX
        let posY

        //Handle clicking near edge (right)
        if ( (<any>ev).clientX + obj.offsetWidth > window.innerWidth ) {
			let x = (<any>ev).clientX - obj.offsetWidth;
			if (x < 0)
				posX = 0;
			else
				posX = x;
		} else
			posX = (<any>ev).clientX;
        obj.style.left = `${posX}px`;

        
        //Handle clicking near edge (down)
		if ( (<any>ev).clientY + obj.offsetHeight > window.innerHeight ) {
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
            this.addPost('Choose', 'contextMenu/pointer.png', () => {
                params.choose();
            });

            this.addPost('Edit', 'contextMenu/edit.png', () => {
                CategoryDialog.open(params);
            });

            this.addPost('Delete', 'common/delete_color.png', () => {
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
            this.addPost('Choose', 'contextMenu/pointer.png', () => {
                params.choose();
            });

            this.addPost('Edit', 'contextMenu/edit.png', () => {
                
            });

            this.addPost('Delete', 'common/delete_color.png', () => {
                Left.categories.curr.promptRemoveNote(params);
            });

            this.addPost('Info', 'common/info_color.png', () => {
                NoteInfo.open(params);
            });
        } else if (what === 'categoryList') {
            // No params
            this.addPost('Create a category', 'common/add_category_color.png', () => {
                CategoryDialog.open();
            });
        } else if (what === 'noteList') {
            // No params
            this.addPost('Create a note', 'common/add_note_color.png', () => {
                Editor.open(true);
            });
        }
    },
    
    addPost(name, imgSrc, callback) {
        let parent = document.createElement('div');
        parent.classList.add('contextMenu-entry');
        parent.onclick = () => {callback(); ContextMenu.close();};
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