"use strict";
;
const Alert = {
    initialized: false,
    shown: false,
    allowClose: true,
    init() {
        // Assign listeners
        $id('alert-dialogButton-abort').onclick = () => {
            Alert.close();
        };
    },
    open(title, text, buttonText, callback) {
        if (!this.initialized) {
            this.init();
            this.initialized = true;
        }
        $id('alert-title').innerHTML = title;
        $id('alert-text').innerHTML = text;
        $id('alert-dialogButton-action').innerHTML = buttonText;
        $id('alert-dialogButton-action').onclick = () => {
            callback();
            Alert.close();
        };
        this.shown = true;
        $id('alert').style.display = 'flex';
        setTimeout(() => {
            $id('alert-content').style.opacity = '1';
            $id('alert-content').style.transform = 'translateY(0px)';
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
    clear() {
    },
    close() {
        this.shown = false;
        this.clear();
        $id('alert').style.display = 'none';
        $id('alert-content').style.opacity = '0';
        $id('alert-content').style.transform = 'translateY(-20px)';
    }
};
