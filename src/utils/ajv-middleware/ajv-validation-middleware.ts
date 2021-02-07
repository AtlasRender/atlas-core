/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import Ajv, {JSONSchemaType} from "ajv";
import RequestError from "../../errors/RequestError";
import {Middleware} from "koa";


/**
 * validatorFactory - returns validator based on schema.
 * @function
 * @param schema - Ajv schema for validation
 * @param ajvInst - Ajv instance
 * @author Denis Afendikov
 */
const validatorFactory = <T>(schema: JSONSchemaType<T>, ajvInst: Ajv) => {
    if (!ajvInst) {
        throw ReferenceError("No Ajv instance provided!");
    }

    ajvInst.addSchema(schema);

    return (body) => {
        const isValid = ajvInst.validate(schema, body);
        if (!isValid) {
            throw new RequestError(400, "AJV detect an invalid payload", {
                name: "AJV_INVALID_PAYLOAD",
                errors: ajvInst.errors
            });
        }
    };
};

/**
 * middlewareFactory - returns middleware based on schema.
 * @function
 * @param schema - Ajv schema for validation
 * @param context - key where data will be validated
 * @param ajvInst - Ajv instance
 * @author Denis Afendikov
 *
 */
const middlewareFactory = <T>(schema: JSONSchemaType<T>, context: "body" | "query", ajvInst: Ajv): Middleware => {
    const validator = validatorFactory(schema, ajvInst);
    return async function (ctx, next) {
        try {
            validator(ctx.request[context]);
        } catch (err) {
            ctx.throw(err);
        }
        await next();
    };
};

/**
 * bodyValidator - returns middleware for validating request body.
 * @function
 * @param schema - Ajv schema for validation
 * @param ajvInst - Ajv instance
 * @author Denis Afendikov
 */
export const bodyValidator = <T>(schema: JSONSchemaType<T>, ajvInst: Ajv): Middleware => middlewareFactory(schema, "body", ajvInst);

/**
 * queryValidator - returns middleware for validating request query.
 * @function
 * @param schema - Ajv schema for validation
 * @param ajvInst - Ajv instance
 * @author Denis Afendikov
 */
export const queryValidator = <T>(schema: JSONSchemaType<T>, ajvInst: Ajv): Middleware => middlewareFactory(schema, "query", ajvInst);

/**
 * paramsValidator - returns middleware for validating request params.
 * @function
 * @param schema - Ajv schema for validation
 * @param ajvInst - Ajv instance
 * @author Denis Afendikov
 */
export const paramsValidator = <T>(schema: JSONSchemaType<T>, ajvInst: Ajv): Middleware => {
    const validator = validatorFactory(schema, ajvInst);
    return async function (ctx, next) {
        try {
            validator(ctx.params);
        } catch (err) {
            ctx.throw(err);
        }
        await next();
    };
};