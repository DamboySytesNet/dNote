import { IConfirm } from './interfaces/IConfirm';

import { $id } from './utils';

export const Confirm: IConfirm = {
    initialized: false,
    shown: false,
    allowClose: true,
    confirmed: false,
    cancelCallback: null,

    init() {
        // Assign listeners
        $id('confirm-dialogButton-abort').onclick = () => {
            Confirm.close();
        };
    },

    open(title, text, buttonText, callback, cancelCallback) {
        if (!this.initialized) {
            this.init();
            this.initialized = true;
        }

        this.confirmed = false;
        this.cancelCallback =
            cancelCallback !== undefined ? cancelCallback : null;

        $id('confirm-title').innerHTML = title;
        $id('confirm-text').innerHTML = text;
        $id('confirm-dialogButton-action').innerHTML = buttonText;
        $id('confirm-dialogButton-action').onclick = () => {
            callback();
            this.confirmed = true;
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
            if (this.shown) this.close();
        }
    },

    checkClose() {
        if (this.allowClose) this.close();
        else this.allowClose = true;
    },

    close() {
        if (this.cancelCallback !== null && !this.confirmed)
            this.cancelCallback();
        this.shown = false;
        $id('confirm').style.display = 'none';
        $id('confirm-content').style.opacity = '0';
        $id('confirm-content').style.transform = 'translateY(-20px)';
    }
};
