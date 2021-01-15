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
import root from "../utils/getProjectRoot";


namespace SystemOptions {
    export interface Options {
        /**
         * envFiles - array of environment file paths. Each of this files will be loaded to config.
         */
        envFiles?: string[];
        /**
         * envMask - regexp mask for environment variables filtering.
         */
        envMask?: RegExp;
        /**
         * envKeyTranslator - function for converting keys from ENV variable name to key inside config object.
         * @callback
            * @param value - Input value
         */
        envKeyTranslator?: (value: string) => string;
        /**
         * additionalConfigs - additional config inputs.
         */
        additionalConfigs?: JSONObject<any>[];
        /**
         * disableOptionsMerging - if true, options will be merged with default SystemOptions options.
         * @default false
         */
        disableOptionsMerging?: boolean;
    }
}

/**
 * SystemOptions - class, designed for gathering and merging system configuration from several files.
 * ### This mechanism can gather info from:
 * - SYSTEM ENVIRONMENT VARIABLES
 * - .env
 * - additionalConfig
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
    protected static options: SystemOptions.Options = {
        envFiles: [
            root + "\\..\\.env",
            root + "\\..\\.env.production",
            root + "\\..\\.env.development",
            root + "\\..\\.env.local",
        ]
    };

    /**
     * Initializes the config field of the class by gathering info from all places.
     * @constructor
     * @param options - Gathering options.
     * @author Danil Andreev
     */
    constructor(options?: SystemOptions.Options) {
        if (options) {
            if (options.disableOptionsMerging)
                SystemOptions.options = options;
            else
                _.merge(SystemOptions.options, options);
        }

        // Merging config.json variables to config
        try {
            const configJson: JSONObject<any> = JSON.parse(fs.readFileSync("./../config.json").toString());
            _.merge(SystemOptions.config, configJson);
        } catch (error) {
            if (error.code !== "ENOENT")
                console.error(`Unable to load configuration from "config.json" file.`, error);
        }

        // Merging additional configs to common config
        if (options?.additionalConfigs) {
            for (const config of options.additionalConfigs) {
                if (typeof config === "object") {
                    _.merge(SystemOptions.config, config);
                } else {
                    console.error(`Invalid type of 'additionalConfig' item, expected "object", got "${typeof config}"`);
                }
            }
        }

        SystemOptions.loadEnv();

        // Merging ENV variables to config
        const regExp: RegExp = options?.envMask;
        let configEnv: JSONObject<string> = {};
        for (const key in process.env) {
            if (!regExp || regExp.test(key))
                configEnv[options?.envKeyTranslator ? options.envKeyTranslator(key) : key] = process.env[key];
        }
        _.merge(SystemOptions.config, configEnv);

        console.log(SystemOptions.config);
    }

    /**
     * loadEnv - loads variables from files to process env.
     * @method
     * @author Danil Andreev
     */
    public static loadEnv(): JSONObject<string> {
        const env: JSONObject<string> = {};

        const paths: string[] = SystemOptions.options?.envFiles;
        if (!paths) return env;

        for (const pathname of paths) {
            try {
                const tempEnv: JSONObject<string> = dotenv.parse(fs.readFileSync(pathname).toString());
                _.merge(env, tempEnv);
            } catch (error) {
                console.error(error);
            }
        }

        const prevEnv = process.env;
        _.merge(env, prevEnv);
        process.env = env;

        return env;
    }
}

export default SystemOptions;