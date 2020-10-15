/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 08.10.2020, 21:47
 * All rights reserved.
 */

import * as Ajv from "ajv";
import RequestError from "../../errors/RequestError";

/**
 * validatorFactory - returns validator based on schema.
 * @function
 * @param schema - Ajv schema for validation
 * @param ajvInst - Ajv instance
 * @author Denis Afendikov
 */
const validatorFactory = (schema: object, ajvInst: Ajv.Ajv) => {
    if (!ajvInst) {
        console.error("No Ajv instance provided!");
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
const middlewareFactory = (schema: object, context: "body" | "query", ajvInst: Ajv.Ajv) => {
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
export const bodyValidator = (schema: object, ajvInst: Ajv.Ajv) => middlewareFactory(schema, "body", ajvInst);

/**
 * queryValidator - returns middleware for validating request query.
 * @function
 * @param schema - Ajv schema for validation
 * @param ajvInst - Ajv instance
 * @author Denis Afendikov
 */
export const queryValidator = (schema: object, ajvInst: Ajv.Ajv) => middlewareFactory(schema, "query", ajvInst);

// TODO: add params validator