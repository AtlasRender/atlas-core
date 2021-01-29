/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import SystemLog from "../entities/typeorm/SystemLog";


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
     * @param verbosity - Verbosity level of message.
     * @author Danil Andreev
     */
    public static async log(
        level: Logger.LOG_LEVELS, payload: string,
        {verbosity = 1, disableDB = false}: Logger.Options
    ): Promise<SystemLog> {
        const record = new SystemLog();
        record.level = level;
        record.payload = payload;
        return await record.save();
    }

    /**
     * info - logs message with "info" level.
     * @method
     * @param payload - Payload of the message.
     * @author Danil Andreev
     */
    public static async info(payload: string): Promise<SystemLog> {
        const result = await Logger.log("info", payload);
        return result;
    }

    /**
     * warn - logs message with "warning" level.
     * @method
     * @param payload - Payload of the message.
     * @author Danil Andreev
     */
    public static async warn(payload: string): Promise<SystemLog> {
        const result = await Logger.log("warning", payload);
        return result;
    }

    /**
     * error - logs message with "error" level.
     * @method
     * @param payload - Payload of the message.
     * @author Danil Andreev
     */
    public static async error(payload: string): Promise<SystemLog> {
        const result = await Logger.log("error", payload);
        return result;
    }
}

export namespace Logger {
    export type LOG_LEVELS = "info" | "warning" | "error";
    export type LOG_VERBOSITY = 1 | 2 | 3 | 4;

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