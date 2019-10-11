"use strict";
;
const Confirm = {
    initialized: false,
    shown: false,
    allowClose: true,
    init() {
        // Assign listeners
        $id('confirm-dialogButton-abort').onclick = () => {
            Confirm.close();
        };
    },
    open(title, text, buttonText, callback) {
        if (!this.initialized) {
            this.init();
            this.initialized = true;
        }
        $id('confirm-title').innerHTML = title;
        $id('confirm-text').innerHTML = text;
        $id('confirm-dialogButton-action').innerHTML = buttonText;
        $id('confirm-dialogButton-action').onclick = () => {
            callback();
            Confirm.close();
        };
        this.shown = true;
        $id('confirm').style.display = 'flex';
        setTimeout(() => {
            $id('confirm-content').style.opacity = '1';
            $id('confirm-content').style.transform = 'translateY(0px)';
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
        $id('confirm').style.display = 'none';
        $id('confirm-content').style.opacity = '0';
        $id('confirm-content').style.transform = 'translateY(-20px)';
    }
};
