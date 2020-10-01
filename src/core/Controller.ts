/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:41
 * All rights reserved.
 */

import * as Router from "koa-router";

class Controller {
    protected route: string;
    protected router: Router;

    constructor(route: string) {
        this.route = route;
        this.router = new Router();
    }

    public getRoute(): string {
        return this.route;
    }

    public getRouter(): Router {
        return this.router;
    }

    public get(route: string, ...other): void {
        this.router.use(route, ...other);
    }

    public post(route: string, ...other): void {
        this.router.post(route, ...other);
    }

    public delete(route: string, ...other): void {
        this.router.delete(route, ...other);
    }

    public put(route: string, ...other): void {
        this.router.put(route, ...other);
    }
}

export default Controller;
