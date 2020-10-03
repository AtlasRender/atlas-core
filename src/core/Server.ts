/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:48
 * All rights reserved.
 */

import * as Koa from "koa";
import * as Router from "koa-router";
import * as moment from "moment";
import {importClassesFromDirectories} from "typeorm/util/DirectoryExportedClassesLoader";
import {Logger as TypeOrmLogger, QueryRunner} from "typeorm";
import Controller from "./Controller";
import {Context, Next} from "koa";


/**
 * ServerConfig - configuration file for server.
 * @interface
 * @export ServerConfig
 * @author Danil Andreev
 */
export interface ServerConfig {
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
}

/**
 * Server - basic web server controller. It can load controllers and write log.
 * @class
 * @author Danil Andreev
 * @export default
 * @example
 * const server = new Server({controllersDir: __dirname + "\\controllers\\**\\*"});
 * server.listen(3002);
 */
export default class Server extends Koa {
    /**
     * ServerConfig - server configuration data.
     * @readonly
     */
    public readonly config: ServerConfig;
    /**
     * controllers - array of server controllers. Needs for requests handling.
     */
    protected controllers: Controller[];
    /**
     * router - main server router. Other routers used by it;
     * @readonly
     */
    public readonly router: Router;

    /**
     * Creates the Server instance. If you want to run the server - call the ___start()___ method.
     * @constructor
     * @param config
     */
    constructor(config: ServerConfig) {
        console.log(`Server: initializing.`);
        super();
        this.config = config;
        this.router = new Router();

        // Creating additional functional for routing.
        this.use(async (ctx: Context, next: Next) => {
            console.log(`Server [${moment().format("l")} ${moment().format("LTS")}]: request from (${ctx.hostname}) to route "${ctx.url}".`);
            await next();
        });

        // Getting controllers from directory in config.
        if (this.config.controllersDir) {
            const found: any[] = importClassesFromDirectories(new Logger(), [this.config.controllersDir]);
            const controllers: any[] = [];
            for (const item of found) {
                if (item.prototype instanceof Controller)
                    controllers.push(item);
            }
            console.log(`Server: found controllers: [ ${controllers.map(item => item.name).join(", ")} ]`);
            this.controllers = controllers.map(controller => new controller());

            for (const controller of this.controllers)
                this.router.use(controller.baseRoute, controller.routes(), controller.allowedMethods());
        } else {
            console.warn(`Server: Warning: "config.controllersDir" is not defined, controllers will not be loaded.`);
        }

        // Applying router routes.
        this.use(this.router.routes()).use(this.router.allowedMethods());
    }

    /**
     * start - starts the wev server message handling cycle. If you want to run the server - call this method;
     * @method
     * @author Danil Andreev
     */
    public start(port?: string | number) {
        const targetPort = port || this.config.port || 3002;
        console.log(`Server: server is listening on port ${targetPort}.`);
        this.listen(targetPort);
    }
}

/**
 * Logger - empty logger for Server importClassesFromDirectories() function.
 * @class
 * @author Danil Andreev
 */
class Logger implements TypeOrmLogger {
    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    }
}
