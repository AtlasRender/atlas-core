/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10.10.2020, 23:14
 * All rights reserved.
 */

import {ConnectionOptions} from "typeorm";
import * as Redis from "redis";
import * as Amqp from "amqp";

/**
 * ServerConfig - configuration file for server.
 * @interface
 * @export ServerConfig
 * @author Danil Andreev
 */
export default interface ServerConfig {
    /**
     * controllersDir - directory where server should look for controllers.
     * @author Danil Andreev
     */
    controllersDir?: string;
    /**
     * port - port, on which server will start.
     * @author Danil Andreev
     */
    port?: number;
    /**
     * db - database connection options for typeorm
     * @author Danil Andreev
     */
    db: ConnectionOptions;
    /**
     * redis - Redis connection options for redis-typescript.
     */
    redis: Redis.ClientOpts;
    /**
     * rabbit - RabbitMQ connection options for Amqp.
     */
    rabbit: Amqp.ConnectionOptions;
}
