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

    constructor(config?: ServerConfig) {
        super();
        this.config = config;
        this.logger = new Logger();

        if (this.config.controllersDir) {
            const found: any[] = importClassesFromDirectories(this.logger, [this.config.controllersDir]);
            const controllers: Controller[] = [];
            for (const item of found) {
                item instanceof Controller && controllers.push(item);
            }
            this.controllers = controllers;
        }

        this.router = new Router();
        this.controllers.map(controller => this.router.use(controller.getBaseRoute(), controller.routes()));
    }
    public start(): Server {
        this.listen(this.config.port || 3002);
        return this;
    }
}