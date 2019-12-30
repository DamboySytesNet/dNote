export interface IConfirm {
    /** Is initialized */
    initialized: boolean;

    /** Is shown */
    shown: boolean;

    /** Permission to close */
    allowClose: boolean;

    /** Check if was confirmed after close */
    confirmed: boolean;

    /** Callback after denial */
    cancelCallback: any;

    /** Initialize dialog */
    init(): void;

    /**
     * Open confirm dialog
     * @param title dialog title to be displayed
     * @param text additional description
     * @param buttonText text on the confim button
     * @param callback callback after confirmation
     * @param cancelCallback callback after denial
     */
    open(
        title: string,
        text: string,
        buttonText: string,
        callback: any,
        cancelCallback?: any
    ): void;

    /** Key handler */
    keyHandler(ev: KeyboardEvent): void;

    /** Check if allowed to close */
    checkClose(): void;

    /** Close dialog */
    close(): void;
}
