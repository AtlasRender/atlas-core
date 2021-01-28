/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import * as Router from "koa-router";
import JSONObject from "../interfaces/JSONObject";
import Route from "../decorators/Route";


namespace Controller {
    /**
     * Meta - interface for controller metadata.
     * @interface
     * @author Danil Andreev
     */
    export interface Meta extends JSONObject<any> {
        /**
         * routes - registered controller routes with methods.
         */
        routes?: JSONObject<Route.Meta>;
    }
}

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
     */
    public baseRoute: string;

    public meta: Controller.Meta;

    /**
     * Creates Controller instance.
     * @constructor
     * @author Danil Andreev
     * @param route Basic route of controller. Will work as prefix to all other router inside.
     */
    constructor(route: string = "") {
        super();
        if (!this.baseRoute) this.baseRoute = route;
        if (!this.meta) this.meta = {};
    }
}

export default Controller;
