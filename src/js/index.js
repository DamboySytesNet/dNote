"use strict";
/**
 * Notes:
 * Set the background of category
 * Search is toggled every time user presses 'Esc'... Needs a fix
 */
//Setting constants
const FS = require('fs');
const PATH = require('path');
// const ASYNC = require('async');
const ELECTRON = require('electron');
const REMOTE = ELECTRON.remote;
const BW = REMOTE.BrowserWindow;
const WindowAction = {
    init() {
        Left.assignListeners();
        ContextMenu.assignListeners();
        Main.init();
    },
    keyHandler(ev) {
        Left.keyHandler(ev);
        CategoryDialog.keyHandler(ev);
        if (ev.key === 'F5') {
            window.location.reload();
        }
    },
    minimize() {
        //Minimize the window
        REMOTE.BrowserWindow.getFocusedWindow().minimize();
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
