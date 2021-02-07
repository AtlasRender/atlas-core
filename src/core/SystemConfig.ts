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
import createRef from "../utils/createRef";
import Ref from "../interfaces/Ref";
import Logger from "./Logger";


namespace SystemConfig {
    /**
     * EnvDispatcher - type for environment dispatcher function.
     * This function should place data from ENV to right place in config.
     */
    export type EnvDispatcher = (configRef: Ref<JSONObject>, value: string, execArray: RegExpExecArray, regExp: RegExp) => void;

    /**
     * Options - interface for SystemConfig additional options.
     * @interface
     * @author Danil Andreev
     */
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
        envDispatcher?: EnvDispatcher;
        /**
         * additionalConfigs - additional config inputs.
         */
        additionalConfigs?: JSONObject<any>[];
        /**
         * disableOptionsMerging - if true, options will be merged with default SystemConfig options.
         * @default false
         */
        disableOptionsMerging?: boolean;
    }
}

// TODO create tests!!!
/**
 * SystemConfig - class, designed for gathering and merging system configuration from several files.
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
class SystemConfig {
    /**
     * config - full system configuration object.
     */
    public static config: JSONObject<any> = {};
    /**
     * options - SystemConfig options.
     */
    protected static options: SystemConfig.Options = {
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
    constructor(options?: SystemConfig.Options) {
        if (options) {
            if (options.disableOptionsMerging)
                SystemConfig.options = options;
            else
                _.merge(SystemConfig.options, options);
        }

        // Merging config.json variables to config
        try {
            const configJson: JSONObject<any> = JSON.parse(fs.readFileSync("./../config.json").toString());
            _.merge(SystemConfig.config, configJson);
        } catch (error) {
            if (error.code !== "ENOENT")
                Logger.error({
                    disableDB: true,
                    verbosity: 1
                })(`Unable to load configuration from "config.json" file.`, error.method, error.stack);
        }

        // Merging additional configs to common config
        if (options?.additionalConfigs) {
            for (const config of options.additionalConfigs) {
                if (typeof config === "object") {
                    _.merge(SystemConfig.config, config);
                } else {
                    Logger.error({
                        disableDB: true,
                        verbosity: 1
                    })(`Invalid type of 'additionalConfig' item, expected "object", got "${typeof config}"`);
                }
            }
        }

        SystemConfig.loadEnv();

        // Merging ENV variables to config
        const regExp: RegExp = options?.envMask;
        const configRef: Ref<JSONObject> = createRef(SystemConfig.config);
        for (const key in process.env) {
            if (!regExp || regExp.test(key)) {
                const execArray: RegExpExecArray = regExp.exec(key);
                const envDispatcher: SystemConfig.EnvDispatcher = SystemConfig.options?.envDispatcher || SystemConfig.defaultEnvDispatcher;
                envDispatcher(configRef, process.env[key], execArray, regExp);
            }
        }
        _.merge(SystemConfig.config, configRef.current);
    }

    /**
     * loadEnv - loads variables from files to process env.
     * @method
     * @author Danil Andreev
     */
    public static loadEnv(): JSONObject<string> {
        const env: JSONObject<string> = {};

        const paths: string[] = SystemConfig.options?.envFiles;
        if (!paths) return env;

        for (const pathname of paths) {
            try {
                const tempEnv: JSONObject<string> = dotenv.parse(fs.readFileSync(pathname).toString());
                _.merge(env, tempEnv);
            } catch (error) {
                if (error.code === "ENOENT")
                    Logger.warn({disableDB: true, verbosity: 4})(`Could not find env file "${pathname}", skipping`);
                else
                    Logger.error({disableDB: true, verbosity: 1})(error.message, error.stack);
            }
        }

        const prevEnv = process.env;
        _.merge(env, prevEnv);
        process.env = env;

        return env;
    }

    /**
     * defaultEnvDispatcher - default environment variables dispatcher.
     * By default it will place to config root values with ENV variable name as key.
     * @method
     * @param configRef - Reference for config object.
     * @param value - Value derived from ENV.
     * @param execArray - RegExp exec array.
     * @param regExp - regular expression.
     * @author Danil Andreev
     */
    public static defaultEnvDispatcher(configRef: Ref<JSONObject>, value: string, execArray: RegExpExecArray, regExp: RegExp): void {
        configRef.current[execArray.input] = value;
    }
}

export default SystemConfig;
