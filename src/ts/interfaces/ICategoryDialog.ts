import { Category } from '../dataTypes/Category';

export interface ICategoryDialog {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;
    currentColor: number;

    editedElement: Category;

    colorSquares: number;
    colors: string[];

    init(): void;
    open(category?: Category): void;
    keyHandler(ev: KeyboardEvent): void;
    checkClose(): void;
    clear(): void;
    close(): void;

    check(): void;
    randomizeColors(): void;
    chooseColor(no: number): void;
    unselectColor(): void;
    clearInputError(): void;
};
