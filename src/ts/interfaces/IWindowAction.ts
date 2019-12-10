export interface IWindowAction {
    /**
     * Distribute KeyboardEvent to all handlers
     * @param KeyboardEvent - event to pass
     */
    keyHandler(ev: KeyboardEvent): void;

    /**
     * Assign basic window actions
     * Minimize, Maximize, Close
     */
    assignListeners(): void;

    /**
     * Minimze window
     */
    minimize(): void;

    /**
     * Toggle window maximize
     */
    maximize(): void;

    /**
     * Close window
     */
    close(): void;
};
