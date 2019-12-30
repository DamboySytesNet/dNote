import { Category } from '../dataTypes/Category';

export interface ICategoryDialog {
    /** Is initialized */
    initialized: boolean;

    /** Is shown */
    shown: boolean;

    /** Permission to close the dialog */
    allowClose: boolean;

    /** Selected color */
    currentColor: number;

    /** Edited category element  */
    editedElement: Category;

    /** Number of squares */
    colorSquares: number;

    /** Colors to choose from */
    colors: string[];

    /** Initialize colors */
    init(): void;

    /**
     * Open category dialog for editing or creating
     * @param category (optional) category to be edited
     */
    open(category?: Category): void;

    /** Key handler */
    keyHandler(ev: KeyboardEvent): void;

    /** Check if allowed to close */
    checkClose(): void;

    /** Clear dialog */
    clear(): void;

    /** Close dialog */
    close(): void;

    /** Accept dialog values */
    check(): void;

    /** Randomize colors */
    randomizeColors(): void;

    /**
     * Select color square
     * @param no number of the color square
     */
    chooseColor(no: number): void;

    /** Remove selection from color square */
    unselectColor(): void;

    /** Clear error messages */
    clearInputError(): void;
}
