export interface IContentOptions {
    shown: boolean;

    toggle(state?: boolean): void;
    handlePin(): void;
    addTag(): void;
    removeTag(tagName: string): void;
}
