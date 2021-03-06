import '../scss/index.scss';
import '../icons/app/128x128.png';

import * as Electron from 'electron';

import { IWindowAction } from './interfaces/IWindowAction';

import { Alert } from './Alert';
import { CategoryDialog } from './CategoryDialog';
import { ColorPicker } from './ColorPicker';
import { Confirm } from './Confirm';
import { ContextMenu } from './ContextMenu';
import { Editor } from './Editor';
import { InputDialog } from './InputDialog';
import { Main } from './Main';
import { NoteInfo } from './NoteInfo';
import { Left } from './Left';
import { Settings } from './Settings';

require('../fonts/opensans/OpenSans-Bold.ttf');
require('../fonts/opensans/OpenSans-Regular.ttf');
require('../fonts/opensans/OpenSans-Light.ttf');

import { $id } from './utils';
import { Categories } from './Categories';

const Remote = Electron.remote;

const WindowAction: IWindowAction = {
    keyHandler(ev) {
        Alert.keyHandler(ev);
        Confirm.keyHandler(ev);
        InputDialog.keyHandler(ev);
        CategoryDialog.keyHandler(ev);
        NoteInfo.keyHandler(ev);
        ColorPicker.keyHandler(ev);
        Settings.keyHandler(ev);

        if (ev.key === 'F5') {
            window.location.reload();
        }
    },

    assignListeners() {
        Left.assignListeners();
        ContextMenu.assignListeners();
        Editor.assignListeners();
        Settings.assignListeners();

        $id('header-minimize').addEventListener('click', () => {
            this.minimize();
        });

        $id('header-maximize').addEventListener('click', () => {
            this.maximize();
        });

        $id('header-close').addEventListener('click', () => {
            this.close();
        });
    },

    minimize() {
        //Minimize the window
        Remote.BrowserWindow.getFocusedWindow().minimize();
    },

    maximize() {
        //Maximize the window
        if (!Remote.BrowserWindow.getFocusedWindow().isMaximized())
            Remote.BrowserWindow.getFocusedWindow().maximize();
        else Remote.BrowserWindow.getFocusedWindow().unmaximize();
    },

    close() {
        window.close();
    }
};

window.onload = () => {
    WindowAction.assignListeners();
    Main.init();
};

window.addEventListener('keyup', (ev: KeyboardEvent) => {
    WindowAction.keyHandler(ev);
});
