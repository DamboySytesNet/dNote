export interface IContext {
    open(ev: MouseEvent, which: string): void;
    close(): void;

    addToContext(what: string, params?: any): void;
    addPost(name: string, imgSrc: string, callback: any): void;
    addSeparator(): void;
    assignListeners(): void;
};
