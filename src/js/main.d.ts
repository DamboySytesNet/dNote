interface IMain {
    /**
     * Number of files that already has been read to app
     */
    filesLoaded: number;
    /**
     * Number of files that has to be read to app
     */
    filesToLoad: number;
    /**
     * Initialize app
     */
    init(): void;
    content: IMainFileHandlers;
    settings: IMainFileHandlers;
    /**
     * Stop main loading
     */
    stopLoading(): void;
    /**
     * Save current categories and notes to a file
     */
    saveContent(): void;
    /**
     * Inform user about failure in reading files and exit app afterwards
     */
    failure(): void;
}
interface IMainFileHandlers {
    /**
     * Init loading
     */
    init(): void;
    /**
     * Load data from file
     */
    load(): void;
    /**
     * Parse settings from file and handle it
     * @param strFromFile - string from file to parse
     */
    parse(strFromFile: string): void;
    /**
     * Handle parsed data
     * @param parsedData - parsed data to handle
     */
    handle(parsedData: any): void;
}
declare const Main: IMain;
