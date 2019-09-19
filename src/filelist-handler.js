// @ts-check
/// <reference path="../types.d.ts"/>
const path = require('path');
const fse = require('fs-extra');
const walkdir = require('walkdir');
const {posixNormalize, getIsRelativePath} = require('./helpers');

const FilelistHandler = (function() {
	const internalDirBlockList = [
		'node_modules',
		'.git'
	];
	const internalDirBlockPatterns = [
		// Block all .___ directories
		/^\..*$/,
		// Block all __tests__ and similar
		/^__[^_]+__$/
	];
	const internalFileBlockPatterns = [
		// .__ files
		/^\..+$/
	];
	/**
	*
	* @param {FinalizedOptions} optionsObj - Options
	*/
	function FilelistHandlerInner(optionsObj) {
		this.inputOptions = optionsObj;
		/**
		* @type Array<{relativeToProjRoot:string, fullPath: string}>
		*/
		this.filePaths = [];

		// Parse filter options
		/**
		 * Construct a list of directories that will be scanned for files
		 * If
		 */
		this.contentDirs = [optionsObj.projectRootPath];
		if (Array.isArray(optionsObj.onlyIn) && optionsObj.onlyIn.length > 0) {
			this.contentDirs = optionsObj.onlyIn;
		}
		this.fullPathContentDirs = this.contentDirs.map(function(pathStr) {
			return path.normalize(getIsRelativePath(pathStr) ? (optionsObj.projectRootPath + '/' + pathStr) : pathStr);
		});

		this.alwaysAllowFileNames = optionsObj.allowFiles;
		this.alwaysAllowFilePaths = this.alwaysAllowFileNames.map(function(pathStr) {
			return path.normalize(getIsRelativePath(pathStr) ? (optionsObj.projectRootPath + '/' + pathStr) : pathStr);
		});
		this.restrictByDir = Array.isArray(optionsObj.onlyIn) && optionsObj.onlyIn.length > 0;
		this.usesCache = typeof (optionsObj.outputFileName) === 'string';
		this.usesBlockFiles = Array.isArray(optionsObj.blockFiles) && optionsObj.blockFiles.length > 0;
		// Process input files
		for (let x = 0; x < optionsObj.files.length; x++) {
			let filePath = optionsObj.files[x];
			filePath = path.normalize(getIsRelativePath(filePath) ? (optionsObj.projectRootPathTrailingSlash + filePath) : filePath);
			this.pushFilePath(filePath, true);
		}
		/**
		 * If no files were passed through the explicit "files" option, this block will walk through directories to scan for files
		 */
		if (optionsObj.files.length === 0) {
			// Get *all* files contained within content dirs
			// Iterate over all dirs of interest
			for (let x = 0; x < this.fullPathContentDirs.length; x++) {
				const fullContentDirPath = this.fullPathContentDirs[x];
				// Walk the dir and built paths
				const paths = walkdir.sync(fullContentDirPath, function(pathStr) {
					const pathDirName = path.basename(pathStr);
					let blocked = false;
					// Check internal block list of directories
					if (internalDirBlockList.indexOf(pathDirName) !== -1) {
						blocked = true;
					}
					if (!blocked) {
						for (let db = 0; db < internalDirBlockPatterns.length; db++) {
							if (internalDirBlockPatterns[db].test(pathDirName)) {
								blocked = true;
								break;
								// DebugLog('Blocked based on DirBlockPatt - ' + pathDirName);
							}
						}
					}
					if (blocked) {
						this.ignore(pathStr);
					}
				});
				// Walk the individual files and check
				for (let p = 0; p < paths.length; p++) {
					let blocked = false;
					const fileOrDirName = path.basename(paths[p]);
					for (let b = 0; b < internalFileBlockPatterns.length; b++) {
						if (internalFileBlockPatterns[b].test(fileOrDirName)) {
							blocked = true;
							break;
						}
					}
					if (!blocked) {
						this.pushFilePath(paths[p], false);
					}
				}
			}
		}
		/* istanbul ignore if */
		if (optionsObj.debug) {
			console.log(this.filePaths);
		}
	}
	/**
	 * Checks if a file is on the allowFiles list (aka the whitelist)
	 * @param {string} filePath - the filepath to check
	 * @returns {boolean} - If the file is on the whitelist
	 */
	FilelistHandlerInner.prototype.getIsFileOnWhitelist = function(filePath) {
		const fileName = path.basename(filePath);
		if (this.alwaysAllowFileNames.indexOf(fileName) !== -1) {
			return true;
		}
		if (this.alwaysAllowFilePaths.indexOf(filePath) !== -1) {
			return true;
		}
		return false;
	};
	/**
	* Add a file to the queue of file paths to retrieve dates for
	* @param {string} filePath  - The path of the file
	* @param {boolean} [checkExists]  - If the func should check that the file actually exists before adding
	* @returns {boolean} - If the file was added
	*/
	FilelistHandlerInner.prototype.pushFilePath = function(filePath, checkExists) {
		if (this.getShouldTrackFile(filePath, checkExists)) {
			this.filePaths.push({
				relativeToProjRoot: path.normalize(filePath).replace(path.normalize(this.inputOptions.projectRootPathTrailingSlash), ''),
				fullPath: filePath
			});
			return true;
		}
		return false;
	};
	/**
	*
	* @param {string} filePath - The path of the file
	* @param {boolean} [checkExists]  - If the func should check that the file actually exists before adding
	* @returns {boolean} - If the file should be tracked / dates fetched
	*/
	FilelistHandlerInner.prototype.getShouldTrackFile = function(filePath, checkExists) {
		let shouldBlock = false;
		filePath = posixNormalize(filePath);
		const fileName = path.basename(filePath);
		checkExists = typeof (checkExists) === "boolean" ? checkExists : false;
		// Block tracking the actual timestamps file - IMPORTANT: blocks hook loop!
		if (this.usesCache && filePath.indexOf(posixNormalize(this.inputOptions.outputFileName)) !== -1) {
			// Only let this be overrwritten by allowFiles whitelist if gitcommithook is equal to 'none' or unset
			if (this.inputOptions.gitCommitHook === 'pre' || this.inputOptions.gitCommitHook === 'post') {
				return false;
			}
			shouldBlock = true;
		}
		// Triggered by options.onlyIn
		if (this.restrictByDir) {
			let found = false;
			// Block tracking any files outside the indicated content dirs
			for (let x = 0; x < this.fullPathContentDirs.length; x++) {
				const fullContentDirPath = this.fullPathContentDirs[x];
				if (filePath.indexOf(posixNormalize(fullContentDirPath)) !== -1) {
					found = true;
					break;
				}
			}
			if (!found) {
				// Not in content dirs - block adding
				shouldBlock = true;
			}
		}
		// Block tracking any on blacklist
		if (this.usesBlockFiles && this.inputOptions.blockFiles.indexOf(fileName) !== -1) {
			shouldBlock = true;
		}
		if (this.usesBlockFiles && this.inputOptions.blockFiles.indexOf(filePath) !== -1) {
			shouldBlock = true;
		}
		/* istanbul ignore if */
		if (fse.lstatSync(filePath).isDirectory() === true) {
			return false;
		}
		if (checkExists) {
			if (fse.existsSync(filePath) === false) {
				return false;
			}
		}
		if (shouldBlock) {
			// Let  override with allowFiles
			if (this.getIsFileOnWhitelist(filePath)) {
				return true;
			}

			return false;
		}
		return true;
	};
	return FilelistHandlerInner;
})();

module.exports = FilelistHandler;
