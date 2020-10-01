/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:41
 * All rights reserved.
 */

import * as Router from "koa-router";

/**
 * Controller - basic controller class for Server.
 * @class
 * @author Danil Andreev
 * @export default
 * @example
 * import {Context} from "koa";
 * class MyController extends Router {
 *     constructor() {
 *         super("/base");
 *         this.get("/hello", this.handlerGet);
 *         //...
 *     }
 *     public handleGet(ctx: Context) {
 *         ctx.body = "hello world";
 *     }
 *     //...
 * }
 */
class Controller extends Router {
    /**
     * baseRoute - prefix route for controller.
     * @author Danil Andreev
     */
    public readonly baseRoute: string;

    /**
     * Creates Controller instance.
     * @constructor
     * @author Danil Andreev
     * @param route Basic route of controller. Will work as prefix to all other router inside.
     */
    constructor(route: string = "") {
        super();
        this.baseRoute = route;
    }
}

export default Controller;
