import '../scss/index.scss';
import '../icons/app/128x128.png';

import * as Electron from 'electron';

import { Alert } from './Alert';
import { CategoryDialog } from './CategoryDialog';
import { ColorPicker } from './ColorPicker';
import { Confirm } from './Confirm';
import { ContextMenu } from './ContextMenu';
import { Editor } from './Editor';
import { Input } from './Input';
import { Main } from './Main';
import { Left } from './Left';
import { Settings } from './Settings';

import { $id } from './utils';

const Remote = Electron.remote;

const WindowAction = {
    init() {
        Left.assignListeners();
        ContextMenu.assignListeners();
        Editor.assignListeners();
        Settings.assignListeners();

        Main.init();

        this.assignListeners();
    },

    keyHandler(ev: KeyboardEvent) {
        Left.keyHandler(ev);
        Alert.keyHandler(ev);
        Confirm.keyHandler(ev);
        Input.keyHandler(ev);
        CategoryDialog.keyHandler(ev);
        ColorPicker.keyHandler(ev);
        Settings.keyHandler(ev);

        if (ev.key === 'F5') {
            window.location.reload();
        }
    },

    assignListeners() {
        document.body.addEventListener('click', (ev: KeyboardEvent) => {
            this.keyHandler(ev);
        });

        $id('header-minimize').addEventListener('click', () => {
            this.minimize();
        });

        $id('header-close').addEventListener('click', () => {
            this.close();
        });
    },

    minimize() {
        //Minimize the window
        Remote.BrowserWindow.getFocusedWindow().minimize();
    },

    // maximize() {
    // 	//Maximize the window
    // 	if (!REMOTE.BrowserWindow.getFocusedWindow().isMaximized())
    // 		REMOTE.BrowserWindow.getFocusedWindow().maximize();
    // 	else
    // 		REMOTE.BrowserWindow.getFocusedWindow().unmaximize();
    // },

    close() {
        window.close();
    }
};

window.onload = () => {
    WindowAction.init();
}
