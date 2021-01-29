/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 29.01.2021, 00:39
 * All rights reserved.
 */

import {Middleware} from "koa";
import Controller from "../core/Controller";


/**
 * RouteValidation - decorator for HTTP controller route middlewares.
 * @author Danil Andreev
 */
function RouteMiddleware(...middlewares: Middleware<any>[]) {
    return (
        target: Controller,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        if (!target.meta) target.meta = {};
        if (!target.meta.routes) target.meta.routes = {};
        const route = target.meta.routes[propertyKey];
        //TODO: think about next line correctness!
        if (!target.meta.routes[propertyKey]) target.meta.routes[propertyKey] = {...target.meta.routes[propertyKey]};
        if (route?.middlewares)
            target.meta.routes[propertyKey].middlewares.push(...middlewares);
        else
            target.meta.routes[propertyKey].middlewares = [...middlewares];
    }
}

export default RouteMiddleware;
