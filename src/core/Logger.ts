/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import SystemLog from "../entities/typeorm/SystemLog";
import SystemConfig from "./SystemConfig";


/**
 * Logger - System logger. Creates records in database.
 * @class
 * @author Danil Andreev
 */
export default class Logger {
    /**
     * log - creates log record with selected level.
     * @method
     * @param level - Level of the log message.
     * @param payload - Payload of the message.
     * @param options - Log options.
     * @author Danil Andreev
     */
    public static async log(
        level: Logger.LOG_LEVELS,
        payload: Logger.LOG_PAYLOAD,
        options: Logger.Options = {}
    ): Promise<SystemLog> {
        const {verbosity = 1, disableDB = false} = options;

        const systemVerbosity = SystemConfig.config.verbosity || 1;
        if (systemVerbosity < verbosity) return;

        let message: string = "";
        if (Array.isArray(payload))
            message = payload.map(item => String(item)).join(" ");
        else
            message = String(payload);

        switch (level) {
            case "info":
                console.log(message);
                break;
            case "warning":
                console.warn(message);
                break;
            case "error":
                console.error(message);
                break;
        }

        if (disableDB) return;

        const record = new SystemLog();
        record.level = level;
        record.payload = message;
        return await record.save();
    }

    /**
     * info - logs message with "info" level.
     * @method
     * @param payload - Payload of the message.
     * @param options - Log options.
     * @author Danil Andreev
     */
    public static async info(payload: Logger.LOG_PAYLOAD, options?: Logger.Options): Promise<SystemLog> {
        const result = await Logger.log("info", payload, options);
        return result;
    }

    /**
     * warn - logs message with "warning" level.
     * @method
     * @param payload - Payload of the message.
     * @param options - Log options.
     * @author Danil Andreev
     */
    public static async warn(payload: Logger.LOG_PAYLOAD, options?: Logger.Options): Promise<SystemLog> {
        const result = await Logger.log("warning", payload, options);
        return result;
    }

    /**
     * error - logs message with "error" level.
     * @method
     * @param payload - Payload of the message.
     * @param options - Log options.
     * @author Danil Andreev
     */
    public static async error(payload: Logger.LOG_PAYLOAD, options?: Logger.Options): Promise<SystemLog> {
        const result = await Logger.log("error", payload, options);
        return result;
    }
}

export namespace Logger {
    /**
     * LOG_LEVELS - type for logging levels, such as errors, warnings and info.
     */
    export type LOG_LEVELS = "info" | "warning" | "error";
    /**
     * LOG_VERBOSITY - type for log verbosity levels.
     */
    export type LOG_VERBOSITY = 1 | 2 | 3 | 4;
    /**
     * LOG_PAYLOAD - log payload type.
     */
    export type LOG_PAYLOAD = any | any[];
    export interface Options {
        /**
         * verbosity - verbosity level of the message.
         * @default 1
         */
        verbosity?: number;
        /**
         * disableDB - if true, database record with log message will not be created.
         * @default false
         */
        disableDB?: boolean;
    }
}
