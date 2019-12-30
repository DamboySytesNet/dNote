export interface IContext {
    /**
     * Open context menu
     * @param ev mouse event
     * @param which describe what was clicked
     */
    open(ev: MouseEvent, which: string): void;

    /** Hide context */
    close(): void;

    /**
     * Determine what to add to context
     * @param what this value is check for adding posts
     * @param params additional params (eg. note if clicked on note)
     */
    addToContext(what: string, params?: any): void;

    /**
     * Generic method to add post to context
     * @param name name to be displayed
     * @param imgSrc image source to be displayed
     * @param callback callback of click
     */
    addPost(name: string, imgSrc: string, callback: any): void;

    /** Add separator */
    addSeparator(): void;

    /** Assign listeners */
    assignListeners(): void;
}
