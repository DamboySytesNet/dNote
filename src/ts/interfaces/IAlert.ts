export interface IAlert {
    /**
     * Initialized
     */
    initialized: boolean;

    /**
     * Check if is shown
     */
    shown: boolean;

    /**
     * Check if this should be closed
     */
    allowClose: boolean;

    /**
     * Append click listeners
     */
    init(): void;

    /**
     * Open alert dialog
     */
    open(title: string, text: string): void;

    /**
     * Append key listeners
     */
    keyHandler(ev: KeyboardEvent): void;

    /**
     * Check if this should be closed
     */
    checkClose(): void;

    /**
     * Close this dialog 
     */
    close(): void;
};
