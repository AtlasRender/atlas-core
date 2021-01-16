/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/15/21, 3:34 PM
 * All rights reserved.
 */

import * as path from "path";


/**
 * getProjectRoot - returns project root directory path.
 * @function
 * @author Danil Andreev
 */
export function getProjectRoot(): string {
    return path.dirname(require.main.filename || process.mainModule.filename);
}

/**
 * root - project root directory path.
 */
const root: string = getProjectRoot();
export default root;
