import { IMainFileHandlers } from './IMainFileHandlers';

export interface IMain {
    /**
     * Number of files that already has been loaded
     */
    filesLoaded: number;

    /**
     * Number of files that are necessary to run app
     */
    filesToLoad: number;

    /**
     * Starts basic app functionality
     * 1. Loads settings
     * 2. Initializes editor
     */
    init(): void;

    /** Manager for loading content from file */
    content: IMainFileHandlers;
    /** Manager for loading settings from file */
    settings: IMainFileHandlers;

    /**
     * Stop main loading
     */
    stopLoading(): void;

    /**
     * Save current categories and notes to a file
     */
    saveContent(): boolean;

    /**
     * Save current settings to a file
     */
    saveSettings(): boolean;

    /**
     * Inform user about failure in reading files and exit app afterwards
     */
    failure(): void;
}
