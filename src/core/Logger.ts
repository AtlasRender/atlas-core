/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import SystemLog from "../entities/typeorm/SystemLog";
import SystemConfig from "./SystemConfig";
import * as moment from "moment";
import {getManager} from "typeorm";


/**
 * Logger - System logger. Creates records in database.
 * @class
 * @author Danil Andreev
 */
class Logger {
    /**
     * log - preparing payload for logging.
     * @method
     * @param level - Level of the log message.
     * @param options - Log options.
     * @author Danil Andreev
     */
    public static log(level: Logger.LOG_LEVELS, options: Logger.Options = {}): Function {
        /**
         * Doing logging task.
         * @function
         * @author Danil Andreev
         */
        return async (...params: any[]): Promise<void> => {
            const {verbosity = 4, disableDB = false} = options;

            const systemVerbosity = SystemConfig.config.verbosity || 1;
            if (systemVerbosity < verbosity) return;

            //TODO: add timestamp flag.
            if (true)
                params.unshift(`[${moment().format("l")} ${moment().format("LTS")}]`);


            switch (level) {
                case "info":
                    console.log("", ...params);
                    break;
                case "warning":
                    console.warn("\x1b[33m", ...params);
                    break;
                case "error":
                    console.error("", ...params);
                    break;
            }

            if (disableDB) return;
            const message = params.map(item => String(item)).join(" ");

            const record = new SystemLog();
            record.level = level;
            record.payload = message;

            getManager().transaction(async transaction => {
                await transaction.save(record);
                await transaction
                    .createQueryBuilder()
                    .delete()
                    .from(SystemLog)
                    .where(
                        "createdAt < :date",
                        {date: moment().subtract(2, "days").toISOString()}
                    )
                    .execute();
            }).then().catch(error => Logger.error({verbosity: 4})(error.message, error.stack).then());
        };
    }

    /**
     * info - logs message with "info" level.
     * @method
     * @param payload - Payload of the message.
     * @param options - Log options.
     * @author Danil Andreev
     */
    public static info(options?: Logger.Options): Function {
        const callback = Logger.log("info", options);
        return callback;
    }

    /**
     * warn - logs message with "warning" level.
     * @method
     * @param payload - Payload of the message.
     * @param options - Log options.
     * @author Danil Andreev
     */
    public static warn(options?: Logger.Options): Function {
        const callback = Logger.log("warning", options);
        return callback;
    }

    /**
     * error - logs message with "error" level.
     * @method
     * @param payload - Payload of the message.
     * @param options - Log options.
     * @author Danil Andreev
     */
    public static error(options?: Logger.Options): Function {
        const callback = Logger.log("error", options);
        return callback;
    }
}

namespace Logger {
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
         * @default 4
         */
        verbosity?: LOG_VERBOSITY;
        /**
         * disableDB - if true, database record with log message will not be created.
         * @default false
         */
        disableDB?: boolean;
    }
}

export default Logger;
