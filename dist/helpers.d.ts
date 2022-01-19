export type BirthStamps = {
    [x: string]: any;
};
export type SemVerInfo = {
    [x: string]: any;
};
export type KernelInfo = {
    [x: string]: any;
};
/**
* Normalizes and forces a filepath to the forward slash variant
* Example: \dir\file.txt will become /dir/file.txt
* @param {string} filePath the path to normalize
* @returns {string} The posix foward slashed version of the input
*/
export function posixNormalize(filePath: string): string;
/**
 * Replaces any root level values on an object that are 0, with a different value
 * @param {{[k: string]: any}} inputObj  - The object to replace zeros on
 * @param {any} replacement - what to replace the zeros with
 * @returns {object} The object with zeros replaced
 */
export function replaceZeros(inputObj: {
    [k: string]: any;
}, replacement: any): object;
/**
 * Test whether or not we are in a git initialized repo space / folder
 * @param {string} [OPT_folder] - Optional: Folder to use as dir to check in
 * @returns {boolean} Whether or not in git repo
 */
export function getIsInGitRepo(OPT_folder?: string): boolean;
/**
 * Run a replacer function over an object to modify it
 * @param {{[k: string]: any}} inputObj - the object to replace values in
 * @param {(input: any) => any} replacerFunc - cb func to take value, modify, and return it
 * @returns {{[k: string]: any}} - Object with replacements
 */
export function replaceInObj(inputObj: {
    [k: string]: any;
}, replacerFunc: (input: any) => any): {
    [k: string]: any;
};
export let projectRootPath: string;
export const callerDir: string;
export const projectRootPathTrailingSlash: string;
/**
 * Return whether or not a filepath is a relative path
 * @param {string} filePath - Filepath to check
 * @returns {boolean} - If it is, or is not, a relative path.
 */
export function getIsRelativePath(filePath: string): boolean;
/**
 * Are we in a subdirectory of the node_modules folder?
 * @param {string} [OPT_path] - Optional path to use as check dir
 * @returns {boolean} - If we are in node_modules
 */
export function isInNodeModules(OPT_path?: string): boolean;
/**
 * Validates input options and forces them to conform
 * @param {import('./types').InputOptions} input - Options
 * @returns {import('./types').FinalizedOptions} - The vaidated and formatted options
 */
export function validateOptions(input: import('./types').InputOptions): import('./types').FinalizedOptions;
/**
 * Extract an array from a stringified array
 * @param {string} str - input string
 * @returns {string[]} - Array output
 */
export function extractArrFromStr(str: string): string[];
/**
 * Get the "null" destination
 * @returns {string} - The "null" destination
 */
export function getNullDestination(): string;
export const nullDestination: string;
/**
 * Check if a value is a valid stamp value
 * @param {any} stampInt - The stamp value to check
 * @returns {boolean} - Is valid stamp val
 */
export function getIsValidStampVal(stampInt: any): boolean;
/**
 * Checks if two are objects are same (inefficient and bad - uses stringify)
 * @param {object} objA - First obj
 * @param {object} objB - Second obj
 * @returns {boolean} - Are two objs same?
 */
export function lazyAreObjsSame(objA: object, objB: object): boolean;
/**
 * @typedef {Object<string, any>} BirthStamps
 * @property {number} birthtimeMs - Birth time in MS since Epoch
 * @property {number} birthtime - Birth time in sec since Epoch
 * @property {string} source - Where did the info come from
 */
/**
 * Get the birth times of a file
 * @param {string} filePath - The filepath of the file to get birth of
 * @param {boolean} [preferNative] - Prefer using Node FS - don't try for debugfs
 * @param {import('fs-extra').Stats} [OPT_fsStats] - Stats object, if you already have it ready
 * @returns {Promise<BirthStamps>} - Birth stamps
 */
export function getFsBirth(filePath: string, preferNative?: boolean, OPT_fsStats?: import('fs-extra').Stats): Promise<BirthStamps>;
/**
 * @typedef {Object<string,any>} KernelInfo
 * @property {number} base
 * @property {number} major
 * @property {number} minor
 * @property {number} patch
 */
/**
 * Get kernel version of OS (or v # in case of Win)
 * @returns {KernelInfo} - Kernel #
 */
export function getKernelInfo(): KernelInfo;
/**
 * @typedef {Object<string,any>} SemVerInfo
 * @property {number} major
 * @property {number} minor
 * @property {number} patch
 * @property {string} suffix
 * @property {string} releaseLabel
 * @property {string} metadata
 */
/**
 * Get numerical semver info from string
 * Is kind of loose about input format
 * @param {string} versionStr - Version string. For example, from `process.versions.node`
 * @returns {SemVerInfo} - SemVer numerical info as obj
 */
export function getSemverInfo(versionStr: string): SemVerInfo;
/**
 * Promise wrapper around child_process exec
 * @param {string} cmdStr - Command to execute
 * @param {import('child_process').ExecOptions} [options] - Exec options
 * @returns {Promise<string>} - Stdout string
 */
export function execPromise(cmdStr: string, options?: import('child_process').ExecOptions): Promise<string>;
/**
 * Promise wrapper around child_process.spawn
 * @param {string} cmdStr
 * @param {string[]} [args]
 * @param {import('child_process').SpawnOptions} [options]
 * @returns {Promise<string>} stdout
 */
export function spawnPromise(cmdStr: string, args?: string[], options?: import('child_process').SpawnOptions): Promise<string>;
/**
 * Promise wrapper around fs-extra stat
 * @param {string} filePath - Filepath to stat
 * @returns {Promise<import('fs-extra').Stats>}
 */
export function statPromise(filePath: string): Promise<import('fs-extra').Stats>;
/**
 * Get return value of a promise, with a default value, in case it falls
 * @param {Promise<any>} promise
 * @param {any} [defaultVal]
 */
export function failSafePromise(promise: Promise<any>, defaultVal?: any): Promise<any>;
