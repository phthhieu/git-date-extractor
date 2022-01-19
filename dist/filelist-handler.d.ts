export = FilelistHandler;
declare class FilelistHandler {
    /** @param {import('./types').FinalizedOptions} optionsObj */
    constructor(optionsObj: import('./types').FinalizedOptions);
    inputOptions: import("./types").FinalizedOptions;
    /**
    * @type Array<{relativeToProjRoot:string, fullPath: string}>
    */
    filePaths: {
        relativeToProjRoot: string;
        fullPath: string;
    }[];
    /**
     * Construct a list of directories that will be scanned for files
     */
    contentDirs: string[];
    fullPathContentDirs: string[];
    alwaysAllowFileNames: string[];
    alwaysAllowFilePaths: string[];
    restrictByDir: boolean;
    usesCache: boolean;
    usesBlockFiles: boolean;
    /**
     * Checks if a file is on the allowFiles list (aka approved)
     * @param {string} filePath - the filepath to check
     * @returns {boolean} - If the file is on the approved list
     */
    getIsFileOnApproveList(filePath: string): boolean;
    /**
    * Add a file to the queue of file paths to retrieve dates for
    * @param {string} filePath  - The path of the file
    * @param {boolean} [checkExists]  - If the func should check that the file actually exists before adding
    * @returns {boolean} - If the file was added
    */
    pushFilePath(filePath: string, checkExists?: boolean): boolean;
    /**
    * @param {string} filePath - The path of the file
    * @param {boolean} [checkExists]  - If the func should check that the file actually exists before adding
    * @returns {boolean} - If the file should be tracked / dates fetched
    */
    getShouldTrackFile(filePath: string, checkExists?: boolean): boolean;
}
