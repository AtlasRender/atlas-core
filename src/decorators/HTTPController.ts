/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/28/21, 4:24 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";


function HTTPController <T extends {new (...args: any[]): {}}>(constructor: T) {
    return class WrappedController extends constructor {
        constructor(...args: any[]) {
            super(args);
            if (this instanceof Controller) {
                if (this.meta.routes) {
                    for (const key in this.meta.routes) {
                        const route = this.meta.routes[key];
                        const callback = this[key];
                        switch (route.method) {
                            case "GET":
                                this.get(route.route, callback);
                                break;
                            case "POST":
                                this.post(route.route, callback);
                                break;
                            case "PUT":
                                this.put(route.route, callback);
                                break;
                            case "DELETE":
                                this.put(route.route, callback);
                                break;
                            default:
                                throw new TypeError(`Incorrect value of 'method', expected "'GET' | 'POST' | 'PUT' | 'DELETE'", got ${route.method}`);
                        }
                        console.log(`Registered route [${route.method}] ${route.route}`);
                    }
                }
            } else {
                throw new TypeError(`Invalid target class, expected Controller.`);
            }
        }
    }
}

export default HTTPController;