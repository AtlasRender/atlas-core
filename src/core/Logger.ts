/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import SystemLog from "../entities/typeorm/SystemLog";

export type LOG_LEVELS = "info" | "warning" | "error";

export type LogPayload = object | string;

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
     * @author Danil Andreev
     */
    public static async log(level: LOG_LEVELS, payload: LogPayload): Promise<SystemLog> {
        const payloadFinal = typeof payload === "string" ? {message: payload} : payload;
        const record = new SystemLog();
        record.level = level;
        record.payload = payloadFinal;
        return await record.save();
    }

    /**
     * info - logs message with "info" level.
     * @method
     * @param payload - Payload of the message.
     * @author Danil Andreev
     */
    public static async info(payload: LogPayload): Promise<SystemLog> {
        const result = await Logger.log("info", payload);
        return result;
    }

    /**
     * warn - logs message with "warning" level.
     * @method
     * @param payload - Payload of the message.
     * @author Danil Andreev
     */
    public static async warn(payload: LogPayload): Promise<SystemLog> {
        const result = await Logger.log("warning", payload);
        return result;
    }

    /**
     * error - logs message with "error" level.
     * @method
     * @param payload - Payload of the message.
     * @author Danil Andreev
     */
    public static async error(payload: LogPayload): Promise<SystemLog> {
        const result = await Logger.log("error", payload);
        return result;
    }
}
