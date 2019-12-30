export interface IInputDialog {
    /** Is initialized */
    initialized: boolean;

    /** Is shown */
    shown: boolean;

    /** Permission to close dialog */
    allowClose: boolean;

    /** Initialize dialog */
    init(): void;

    /**
     * Open dialog
     * @param title dialog title to be displayed
     * @param text additional description
     * @param inputText placeholder text
     * @param buttonText text on the button
     * @param callback callback with input as parameter
     */
    open(
        title: string,
        text: string,
        inputText: string,
        buttonText: string,
        callback: any
    ): void;

    /** Key handler */
    keyHandler(ev: KeyboardEvent): void;

    /** Check if allowed to close */
    checkClose(): void;

    /** Close dialog */
    close(): void;
}
