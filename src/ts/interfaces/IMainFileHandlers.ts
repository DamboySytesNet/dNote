export interface IMainFileHandlers {
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
};
