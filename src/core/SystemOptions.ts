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

export default class SystemOptions {
    public static config: JSONObject<any> = {};

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

namespace SystemOptions {
    export interface Options {
        envMask?: RegExp;
    }
}