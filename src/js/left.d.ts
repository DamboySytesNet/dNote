interface ILeft {
    search: ILeftSearch;
    assignHandlers(): void;
    keyHandler(ev: KeyboardEvent): void;
}
interface ILeftSearch {
    shown: boolean;
    toggle(): void;
    clear(): void;
}
declare const Left: ILeft;
