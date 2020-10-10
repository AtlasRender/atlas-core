/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 09.10.2020, 18:43
 * All rights reserved.
 */

import * as Ajv from "ajv";

export const ajvInstance = new Ajv({
    allErrors: true,
    useDefaults: true,
    // jsonPointers: true,
    errorDataPath: "property", // deprecated
    schemaId: "auto",
    messages: false,
});