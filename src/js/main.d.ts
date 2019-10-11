interface IMain {
    /**
     * Initialize app
     */
    init(): void;
    /**
     * Get categories and notes from a file
     */
    loadContent(): void;
    /**
     * Parse data from file
     * @param strToParse - string from file to parse
     */
    parseData(strToParse: string): void;
    /**
     * Handle parsed data
     * @param data - parsed data to handle
     */
    handleData(data: any): void;
    /**
     * Stop main loading
     */
    stopLoading(): void;
    /**
     * Save current categories and notes to a file
     */
    saveContent(): void;
}
declare const Main: IMain;
