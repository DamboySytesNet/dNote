interface ISettings {
    open(): void;
    keyHandler(ev: KeyboardEvent): void;
    assignListeners(): void;
    close(): void;
};

const Settings: ISettings = {
    open() {
        $id('settings').style.visibility = 'visible';
        $id('settings').style.opacity = '1';
        $id('settings').style.transform = 'scale(1)';
    },

    keyHandler(ev) {
        if (ev.key === 'Escape')
            this.close();
    },

    assignListeners() {
        $id('settings-close').addEventListener('click', () => {
            Settings.close();
        });
    },

    close() {
        $id('settings').style.opacity = '0';
        $id('settings').style.transform = 'scale(1.2)';
        setTimeout(() => {
            $id('settings').style.visibility = 'hidden';
        }, 300);
    }
}