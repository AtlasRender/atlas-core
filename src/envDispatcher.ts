/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/15/21, 4:55 PM
 * All rights reserved.
 */

import Ref from "./interfaces/Ref";
import JSONObject from "./interfaces/JSONObject";
import SystemConfig from "./core/SystemConfig";

//TODO: add interface for system config!!!!;
/**
 * envDispatcher - function, designed to place variables from env to right places in config.
 * @function
 * @author Danil Andreev
 */
export default function envDispatcher(configRef: Ref<JSONObject>, value: string, execArray: RegExpExecArray, regExp: RegExp) {
    try {
        const name: string = execArray[1].toLowerCase();
        switch (name) {
            case "db_host":
                configRef.current.db.host = value;
                break;
            case "db_port":
                if (isNaN(+value)) throw new Error(`Incorrect type of ENV value 'db_port', expected "number", got "${value}"`);
                configRef.current.db.port = +value;
                break;
            case "db_username":
                configRef.current.db.username = value;
                break;
            case "db_password":
                configRef.current.db.password = value;
                break;
            case "db_database":
                configRef.current.db.database = value;
                break;

            case "redis_port":
                if (isNaN(+value)) throw new Error(`Incorrect type of ENV value 'redis_port', expected "number", got "${value}"`);
                configRef.current.redis.port = +value;
                break;
            case "redis_host":
                configRef.current.redis.host = value;
                break;
            case "redis_password":
                configRef.current.redis.password = value;
                break;

            case "rabbit_hostname":
                configRef.current.rabbit.hostname = value;
                break;
            case "rabbit_port":
                if (isNaN(+value)) throw new Error(`Incorrect type of ENV value 'rabbit_port', expected "number", got "${value}"`);
                configRef.current.rabbit.port = +value;
                break;
            case "rabbit_username":
                configRef.current.rabbit.username = value;
                break;
            case "rabbit_password":
                configRef.current.rabbit.password = value;
                break;

            case "port":
                if (isNaN(+value)) throw new Error(`Incorrect type of ENV value 'port', expected "number", got "${value}"`);
                configRef.current.port = +value;
                break;

            case "verbosity":
                if (isNaN(+value)) throw new Error(`Incorrect type of ENV value 'verbosity', expected "number", got "${value}"`);
                configRef.current.verbosity = +value;
                break;
            default:
                SystemConfig.defaultEnvDispatcher(configRef, value, execArray, regExp);
        }
    } catch (error) {
        console.error(`Invalid ENV variable "${execArray.input}", skipping. Details:\n`, error.message);
    }
}
