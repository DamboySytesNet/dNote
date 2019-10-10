/**
 * Notes:
 * Set the background of category
 * Search is toggled every time user presses 'Esc'... Needs a fix
 */
declare const FS: any;
declare const PATH: any;
declare const ELECTRON: any;
declare const REMOTE: any;
declare const BW: any;
declare const WindowAction: {
    init(): void;
    keyHandler(ev: KeyboardEvent): void;
    minimize(): void;
    close(): void;
};
