import { IMainFileHandlers } from './IMainFileHandlers';

export interface IMain {
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
     * Save current settings to a file
     */
    saveSettings(): void;

    /**
     * Inform user about failure in reading files and exit app afterwards
     */
    failure(): void;
};
