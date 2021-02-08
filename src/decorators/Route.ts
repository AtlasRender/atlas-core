/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/28/21, 3:03 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Middleware} from "koa";


namespace Route {
    /**
     * Meta - interface for Route metadata.
     * @interface
     * @author Danil Andreev
     */
    export interface Meta {
        /**
         * method - HTTP method.
         */
        method: "GET" | "POST" | "PUT" | "DELETE";
        /**
         * route - target route.
         */
        route: string;
        /**
         * validation - validation middleware.
         */
        validation?: Middleware<any>
        /**
         * middlewares - an array of request middlewares.
         */
        middlewares?: Middleware<any>[];
    }
}

/**
 * Route - decorator for HTTP controller route.
 * @param method - HTTP method.
 * @param route - target route.
 * @author Danil Andreev
 */
function Route(method: "GET" | "POST" | "PUT" | "DELETE", route: string) {
    return (
        target: Controller,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        if (!target.meta) target.meta = {};
        if (!target.meta.routes) target.meta.routes = {};
        target.meta.routes[propertyKey] = {...target.meta.routes[propertyKey], method, route};
    };
}

export default Route;
