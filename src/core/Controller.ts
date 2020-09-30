/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:41
 * All rights reserved.
 */

import * as Router from "koa-router";

class Controller extends Router {
    protected baseRoute: string;

    constructor(route: string) {
        super();
        this.baseRoute = route;
    }

    public getBaseRoute() {
        return this.baseRoute;
    }
}

export default Controller;
