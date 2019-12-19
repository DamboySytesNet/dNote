export interface IEditorMode {
    show(): void;
    hide(): void;
    open(param?: any): Promise<null>;
}
