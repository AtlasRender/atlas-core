/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:48
 * All rights reserved.
 */

import * as Koa from "Koa";
import * as Router from "koa-router";
import * as KoaLogger from "koa-logger";
import {importClassesFromDirectories} from "typeorm/util/DirectoryExportedClassesLoader";
import {Logger as TypeOrmLogger, QueryRunner} from "typeorm";
import Controller from "./Controller";

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

export interface ServerConfig {
    controllersDir?: string;
    port?: number;
}

export default class Server extends Koa {
    private config: ServerConfig;
    protected controllers: Controller[];
    protected logger: TypeOrmLogger;
    protected router: Router;

    public constructor(config?: ServerConfig) {
        super();
        this.use(KoaLogger);
        this.config = config;
        this.logger = new Logger();

        console.log(`Pathfinder Core: Loading controllers...`);
        if (this.config.controllersDir) {
            const found: any[] = importClassesFromDirectories(this.logger, [this.config.controllersDir]);
            const controllers: any[] = [];
            for (const item of found) {
                if (item.prototype instanceof Controller)
                    controllers.push(item);
            }
            console.log(`Pathfinder Core: found controllers: [ ${controllers.map(item => item.name).join(", ")} ]`);
            this.controllers = controllers.map(controller => new controller());
        }

        this.router = new Router();

        for (const controller of this.controllers) {
            this.router.use(controller.getRoute(), controller.getRouter().routes(), controller.getRouter().allowedMethods());
        }
        this.use(this.router.routes()).use(this.router.allowedMethods());
    }
    public start(): Server {
        const port = this.config.port || 3002;
        this.listen(port);
        console.log(`Pathfinder Core: Server listening on port ${port}`);
        return this;
    }
}