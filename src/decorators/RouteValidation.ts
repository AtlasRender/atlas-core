/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/28/21, 4:46 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Middleware} from "koa";


/**
 * RouteValidation - decorator for HTTP controller routes validation.
 * @param validation - Validation middleware.
 * @author Danil Andreev
 */
function RouteValidation(validation: Middleware<any>) {
    return (
        target: Controller,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        if (!target.meta) target.meta = {};
        if (!target.meta.routes) target.meta.routes = {};
        target.meta.routes[propertyKey] = {...target.meta.routes[propertyKey], validation};
    };
}

export default RouteValidation;
