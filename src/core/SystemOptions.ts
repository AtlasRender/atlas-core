/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/14/21, 2:56 PM
 * All rights reserved.
 */

import * as dotenv from "dotenv";
import JSONObject from "../interfaces/JSONObject";
import * as fs from "fs";
import * as _ from "lodash";


namespace SystemOptions {
    export interface Options {
        envMask?: RegExp;
    }
}

/**
 * SystemOptions - class, designed for gathering and merging system configuration from several files.
 * ### This mechanism can gather info from:
 * - SYSTEM ENVIRONMENT VARIABLES
 * - .env
 * - config.ts
 * - config.json
 *
 * > Note, list items ordered by priority.
 *
 * @class
 * @author Danil Andreev
 */
class SystemOptions {
    /**
     * config - full system configuration object.
     */
    public static config: JSONObject<any> = {};

    /**
     * Initializes the config field of the class by gathering info from all places.
     * @constructor
     * @param options - Gathering options.
     * @author Danil Andreev
     */
    constructor(options: SystemOptions.Options = {}) {
        dotenv.config();

        try {
            const configJson: JSONObject<any> = require("./../config.json");
            _.merge(SystemOptions.config, configJson);
        } catch (error) {
            if (error.code !== "MODULE_NOT_FOUND")
                console.error(`Unable to load configuration from "config.json" file.`, error);
        }

        try {
            const configScript: JSONObject<any> = require("./../config.ts").config; //TODO: change to default export
            if (typeof configScript !== "object")
                throw new TypeError(`Invalid export from config file, expected "object", got "${typeof configScript}"`);
            _.merge(SystemOptions.config, configScript);
        } catch (error) {
            if (error.code !== "MODULE_NOT_FOUND")
                console.error(`Unable to load configuration from "config.ts" file.`, error);
        }

        //TODO: add loading from env;
    }
}

export default SystemOptions;