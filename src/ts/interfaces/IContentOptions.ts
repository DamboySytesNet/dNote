export interface IContentOptions {
    shown: boolean;

    toggle(state?: boolean): void;
    addTag(): void;
    removeTag(tagName: string): void;
}
