/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/28/21, 4:24 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Middleware} from "koa";


/**
 * HTTPController - decorator for HTTP controllers.
 * @param baseRoute - Base route for controller.
 * @author Danil Andreev
 */
function HTTPController(baseRoute: string = "") {
    return function HTTPControllerWrapper<T extends new(...args: any[]) => {}>(objectConstructor: T): T {
        return class WrappedController extends objectConstructor {
            constructor(...args: any[]) {
                super(args);
                if (this instanceof Controller) {
                    this.baseRoute = baseRoute;
                    if (this.meta.routes) {
                        for (const key in this.meta.routes) {
                            const route = this.meta.routes[key];
                            const callback = this[key];
                            const middlewares: Middleware<any>[] = [];
                            if (route.validation) middlewares.push(route.validation);
                            if (route.middlewares) middlewares.push(...route.middlewares);
                            switch (route.method) {
                                case "GET":
                                    this.get(route.route, ...middlewares, callback);
                                    break;
                                case "POST":
                                    this.post(route.route, ...middlewares, callback);
                                    break;
                                case "PUT":
                                    this.put(route.route, ...middlewares, callback);
                                    break;
                                case "DELETE":
                                    this.delete(route.route, ...middlewares, callback);
                                    break;
                                default:
                                    throw new TypeError(`Incorrect value of 'method', expected "'GET' | 'POST' | 'PUT' | 'DELETE'", got ${route.method}`);
                            }
                        }
                    }
                } else {
                    throw new TypeError(`Invalid target class, expected Controller.`);
                }
            }
        };
    };
}

export default HTTPController;
