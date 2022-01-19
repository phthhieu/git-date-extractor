export type FileToCheckMeta = {
    /**
     * - The *full* file path to get stamps for
     */
    fullFilePath: string;
    /**
     * - What is the stamp currently stored under for this file?
     */
    cacheKey?: string;
    /**
     * - If provided, will be the value used as the key in the results object. Default = fullFilePath
     */
    resultKey?: string;
};
/**
* Updates the timestamp cache file and checks it into source control, depending on settings
* @param {string} cacheFilePath - the path of the files to save the cache out to
* @param {Object} jsonObj - The updated timestamps JSON to save to file
* @param {import('./types').FinalizedOptions} optionsObj - Options
*/
export function updateTimestampsCacheFile(cacheFilePath: string, jsonObj: Object, optionsObj: import('./types').FinalizedOptions): void;
/**
 * @typedef {object} FileToCheckMeta
 * @property {string} fullFilePath - The *full* file path to get stamps for
 * @property {string} [cacheKey] - What is the stamp currently stored under for this file?
 * @property {string} [resultKey] - If provided, will be the value used as the key in the results object. Default = fullFilePath
 */
/**
 *
 * @param {Array<FileToCheckMeta>} filesToGet - Files to retrieve stamps for
 * @param {import('./types').FinalizedOptions} optionsObj - Options
 * @param {import('./types').StampCache} [cache] - Object with key/pair values corresponding to valid stamps
 * @param {boolean} [forceCreatedRefresh] If true, any existing created stamps in cache will be ignored, and re-calculated
 */
export function getTimestampsFromFilesBulk(filesToGet: Array<FileToCheckMeta>, optionsObj: import('./types').FinalizedOptions, cache?: import('./types').StampCache, forceCreatedRefresh?: boolean): Promise<{
    [k: string]: import("./types").StampObject;
}>;
