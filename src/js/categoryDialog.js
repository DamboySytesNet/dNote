"use strict";
;
const CategoryDialog = {
    initialized: false,
    shown: false,
    allowClose: true,
    editedElement: null,
    currentColor: null,
    colors: [null, null, null, null, null, 'rgb(255, 255, 255)'],
    colorSquares: 5,
    init() {
        // Assign listeners
        $id('categoryDialog').addEventListener('click', () => {
            CategoryDialog.checkClose();
        });
        $id('categoryDialog-content').addEventListener('mousedown', () => {
            CategoryDialog.allowClose = false;
        });
        for (let i = 1; i <= this.colorSquares; i++) {
            $id(`categoryDialog-colors-${i}`).addEventListener('click', () => {
                CategoryDialog.chooseColor(i);
            });
        }
        $id('categoryDialog-colors-randomButton').addEventListener('mousedown', () => {
            CategoryDialog.randomizeColors();
        });
        $id('categoryDialog-colors-6').addEventListener('click', () => {
            CategoryDialog.chooseColor(6);
        });
        $id('categoryDialog-colors-6').addEventListener('dblclick', () => {
            ColorPicker.open((color) => {
                CategoryDialog.colors[5] = color;
                CategoryDialog.chooseColor(6);
                $id('categoryDialog-colors-6')
                    .children[0].style.background = color;
            });
        });
        this.randomizeColors();
        $id('categoryDialog-dialogButton-action').addEventListener('click', () => {
            CategoryDialog.check();
        });
        $id('categoryDialog-dialogButton-abort').addEventListener('click', () => {
            CategoryDialog.close();
        });
        $id('categoryDialog-inputValue').addEventListener('focus', () => {
            CategoryDialog.clearInputError();
        });
    },
    open(category) {
        if (!this.initialized) {
            this.init();
            this.initialized = true;
        }
        if (typeof category !== 'undefined' && category !== null) {
            this.editedElement = category;
            $id('categoryDialog-inputValue').value = category.name;
            CategoryDialog.colors[0] = category.color;
            CategoryDialog.chooseColor(1);
            $id('categoryDialog-colors-1')
                .children[0].style.background = category.color;
        }
        this.shown = true;
        $id('categoryDialog').style.display = 'flex';
        setTimeout(() => {
            $id('categoryDialog-content').style.opacity = '1';
            $id('categoryDialog-content').style.transform = 'translateY(0px)';
        }, 100);
    },
    keyHandler(ev) {
        if (ev.key === 'Escape') {
            if (this.shown && !ColorPicker.shown)
                this.close();
        }
    },
    clearInputError() {
        $id('categoryDialog-inputError').innerHTML = '';
    },
    check() {
        // Get values
        let name = $id('categoryDialog-inputValue').value;
        name = name.trim();
        // Validate name
        if (name.length === 0) {
            $id('categoryDialog-inputError').innerHTML = 'Name is invalid';
            return;
        }
        let nameBusy = Categories.stack.some((val) => {
            if (val.name === name) {
                if (this.editedElement !== null && this.editedElement.name === name)
                    return false;
                else
                    return true;
            }
            return false;
        });
        if (nameBusy) {
            $id('categoryDialog-inputError').innerHTML = 'Name is busy';
            return;
        }
        // Validate color
        if (this.currentColor === null) {
            $id('categoryDialog-colorError').innerHTML = 'Choose a color';
            return;
        }
        // Apply changes
        const color = this.colors[this.currentColor - 1];
        if (this.editedElement !== null) {
            this.editedElement.update(name, color);
        }
        else {
            const newId = Categories.stack.length !== 0 ? Categories.stack[Categories.stack.length - 1].id + 1 : 1;
            let category = new Category(newId, name, color, []);
            Left.categories.add(category.leftHTML);
        }
        this.close();
    },
    randomizeColors() {
        if (this.currentColor !== 6)
            this.unselectColor();
        for (let i = 1; i <= this.colorSquares; i++) {
            const min = 0;
            const max = 255;
            const red = randomize(min, max);
            const green = randomize(min, max);
            const blue = randomize(min, max);
            const color = `rgb(${red}, ${green}, ${blue})`;
            this.colors[i - 1] = color;
            $id(`categoryDialog-colors-${i}`)
                .children[0].style.background = color;
        }
    },
    chooseColor(no) {
        $id('categoryDialog-colorError').innerHTML = '';
        this.unselectColor();
        this.currentColor = no;
        $id(`categoryDialog-colors-${this.currentColor}`)
            .setAttribute('name', 'chosen');
    },
    unselectColor() {
        if (this.currentColor !== null) {
            $id(`categoryDialog-colors-${this.currentColor}`)
                .setAttribute('name', '');
            this.currentColor = null;
        }
    },
    checkClose() {
        if (this.allowClose)
            this.close();
        else
            this.allowClose = true;
    },
    clear() {
        $id('categoryDialog-inputValue').value = '';
        $id('categoryDialog-inputError').innerHTML = '';
        this.unselectColor();
    },
    close() {
        this.shown = false;
        this.editedElement = null;
        this.clear();
        $id('categoryDialog').style.display = 'none';
        $id('categoryDialog-content').style.opacity = '0';
        $id('categoryDialog-content').style.transform = 'translateY(-20px)';
    }
};
