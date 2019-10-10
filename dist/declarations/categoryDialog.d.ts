interface ICategoryDialog {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;
    currentColor: number;
    editEl: ICategory;
    colorSquares: number;
    colors: string[];
    init(): void;
    open(el?: ICategory): void;
    keyHandler(ev: KeyboardEvent): void;
    checkClose(): void;
    clear(): void;
    close(): void;
    check(): void;
    randomizeColors(): void;
    chooseColor(no: number): void;
    unselectColor(): void;
    clearInputError(): void;
}
declare const CategoryDialog: ICategoryDialog;
