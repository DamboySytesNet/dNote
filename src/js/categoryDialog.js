"use strict";
;
const CategoryDialog = {
    initialized: false,
    shown: false,
    allowClose: true,
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
    open() {
        if (!this.initialized) {
            this.init();
            this.initialized = true;
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
            if (this.shown)
                this.close();
        }
    },
    clearInputError() {
        $id('categoryDialog-inputError').innerHTML = '';
    },
    check() {
        if (Main.data !== null) {
            let name = $id('categoryDialog-inputValue').value;
            name = name.trim();
            if (name.length === 0) {
                $id('categoryDialog-inputError').innerHTML = 'Name is invalid';
                return;
            }
            let nameBusy = Main.data.some((val) => {
                return val.name === name ? true : false;
            });
            if (nameBusy) {
                $id('categoryDialog-inputError').innerHTML = 'Name is busy';
                return;
            }
            if (this.currentColor === null) {
                $id('categoryDialog-colorError').innerHTML = 'Choose a color';
                return;
            }
            const color = this.colors[this.currentColor - 1];
            const newId = Main.data.length !== 0 ? Main.data[Main.data.length - 1].id + 1 : 1;
            Main.data.push({
                id: newId,
                name: name,
                color: color,
                html: null,
                notes: []
            });
            Main.saveContent();
            Main.handleData();
            this.close();
        }
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
        $id('categoryDialog-input').value = '';
        $id('categoryDialog-inputError').innerHTML = '';
        this.unselectColor();
    },
    close() {
        this.shown = false;
        this.clear();
        $id('categoryDialog').style.display = 'none';
        $id('categoryDialog-content').style.opacity = '0';
        $id('categoryDialog-content').style.transform = 'translateY(-20px)';
    }
};
