"use strict";
;
const Input = {
    initialized: false,
    shown: false,
    allowClose: true,
    init() {
        // Assign listeners
        $id('input-dialogButton-abort').onclick = () => {
            Input.close();
        };
    },
    open(title, text, inputText, buttonText, callback) {
        if (!this.initialized) {
            this.init();
            this.initialized = true;
        }
        $id('input-title').innerHTML = title;
        if (text !== '') {
            $id('input-text').style.display = 'block';
            $id('input-text').innerHTML = text;
        }
        else {
            $id('input-text').style.display = 'none';
            $id('input-text').innerHTML = '';
        }
        if (text !== '')
            $id('input-input').placeholder = inputText;
        else
            $id('input-input').placeholder = 'Enter here...';
        $id('input-dialogButton-action').innerHTML = buttonText;
        $id('input-dialogButton-action').onclick = () => {
            callback($id('input-input').value);
            Input.close();
        };
        this.shown = true;
        $id('input').style.display = 'flex';
        setTimeout(() => {
            $id('input-content').style.opacity = '1';
            $id('input-content').style.transform = 'translateY(0px)';
        }, 100);
    },
    keyHandler(ev) {
        if (ev.key === 'Escape') {
            if (this.shown)
                this.close();
        }
    },
    checkClose() {
        if (this.allowClose)
            this.close();
        else
            this.allowClose = true;
    },
    close() {
        this.shown = false;
        $id('input').style.display = 'none';
        $id('input-content').style.opacity = '0';
        $id('input-content').style.transform = 'translateY(-20px)';
    }
};
