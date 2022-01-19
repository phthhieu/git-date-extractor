export declare type GitCommitHook = "pre" | "post" | "none";
export interface StampObject {
    "created"?: number | boolean;
    "modified"?: number | boolean;
}
export interface StampCache {
    [index: string]: StampObject;
}
export interface InputOptions {
    outputToFile?: boolean;
    outputFileName?: string;
    outputFileGitAdd?: boolean;
    files?: string[] | string;
    onlyIn?: string[] | string;
    blockFiles?: string[] | string;
    allowFiles?: string[] | string;
    gitCommitHook?: string;
    projectRootPath?: string;
    debug?: boolean;
}
export interface FinalizedOptions {
    outputToFile: boolean;
    outputFileName?: string;
    outputFileGitAdd?: boolean;
    files: string[];
    onlyIn?: string[];
    blockFiles?: string[];
    allowFiles: string[];
    gitCommitHook: GitCommitHook;
    projectRootPath: string;
    projectRootPathTrailingSlash: string;
    debug: boolean;
}
export interface DirListing {
    [index: string]: string | DirListing;
}
export declare type UnpackedPromise<T> = T extends Promise<infer U> ? U : T;
