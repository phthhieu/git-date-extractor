/**
* Run the extractor with options
* @param {import('./types').InputOptions} options - input options
* @param {function} [opt_cb] - Optional callback
* @returns {Promise<import('./types').StampCache>} - stamp object or info obj
*/
export function getStamps(options: import('./types').InputOptions, opt_cb?: Function): Promise<import('./types').StampCache>;
