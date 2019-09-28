interface IAlert {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;

    init(): void;
    open(title: string, text: string, buttonText:string, callback: any): void;
    keyHandler(ev: KeyboardEvent): void;
    checkClose(): void;
    close(): void;
};

const Alert: IAlert = {
    initialized: false,
    shown: false,
    allowClose: true,

    init() {
        // Assign listeners
        $id('alert-dialogButton-abort').onclick = () => {
            Alert.close();
        }
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
        }

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

    close() {
        this.shown = false;
        $id('alert').style.display = 'none';
        $id('alert-content').style.opacity = '0';
        $id('alert-content').style.transform = 'translateY(-20px)';
    }
};