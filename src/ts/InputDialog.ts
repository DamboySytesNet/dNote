import { IInputDialog } from './interfaces/IInputDialog';

import { $id } from './utils';

export const InputDialog: IInputDialog = {
    initialized: false,
    shown: false,
    allowClose: true,

    init() {
        this.initialized = true;

        // Assign listeners
        $id('input-dialogButton-abort').onclick = () => {
            InputDialog.close();
        };
    },

    open(title, text, inputText, buttonText, callback) {
        if (!this.initialized) this.init();

        $id('input-title').innerHTML = title;

        if (text !== '') {
            $id('input-text').style.display = 'block';
            $id('input-text').innerHTML = text;
        } else {
            $id('input-text').style.display = 'none';
            $id('input-text').innerHTML = '';
        }

        if (text !== '')
            (<HTMLInputElement>$id('input-input')).placeholder = inputText;
        else
            (<HTMLInputElement>$id('input-input')).placeholder =
                'Enter here...';

        $id('input-dialogButton-action').innerHTML = buttonText;
        $id('input-dialogButton-action').onclick = () => {
            callback((<HTMLInputElement>$id('input-input')).value);
            InputDialog.close();
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
            if (this.shown) this.close();
        } else if (ev.key === 'Enter') {
            if (this.shown) $id('input-dialogButton-action').click();
        }
    },

    checkClose() {
        if (this.allowClose) this.close();
        else this.allowClose = true;
    },

    close() {
        this.shown = false;
        (<HTMLInputElement>$id('input-input')).value = '';
        $id('input').style.display = 'none';
        $id('input-content').style.opacity = '0';
        $id('input-content').style.transform = 'translateY(-20px)';
    }
};
