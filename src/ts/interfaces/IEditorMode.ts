export interface IEditorMode {
    /** Show everything connected with this editor mode */
    show(): void;
    /** Hide everything connected with this editor mode */
    hide(): void;

    /**
     * Open new editor mode if allowed
     * @param param (force or note)
     */
    open(param?: any): Promise<null>;
}
