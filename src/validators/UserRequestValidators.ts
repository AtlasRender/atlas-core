/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 09.10.2020, 20:36
 * All rights reserved.
 */

import {ajvInstance} from "../globals";
import {bodyValidator} from "../utils/ajv-middleware/ajv-validation-middleware";

/**
 * RegisterUserValidator - validator for user registration request.
 * @author Denis Afendikov
 */
export const UserRegisterValidator = bodyValidator({
        $id: "UserRegisterValidator",
        type: "object",
        required: ["username", "email", "password"],
        properties: {
            username: {
                // TODO: alphanumeric only
                // $id: "username",
                type: "string",
                minLength: 3,
                maxLength: 50
            },
            email: {
                type: "string",
                format: "email",
            },
            password: {
                type: "string",
                minLength: 6,
                maxLength: 50
            },
        }

        /*body: Joi.object({
            // TODO: data from config.
            username: Joi.string().alphanum().min(3).max(50).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(30).required(),
        }),*/
    },
    ajvInstance);

/**
 * LoginUserValidator - validator for user l request.
 * @author Denis Afendikov
 */
export const UserLoginValidator = bodyValidator({
        $id: "UserLoginValidator",
        type: "object",
        required: ["username", "password"],
        properties: {
            username: {
                // TODO: alphanumeric only
                // $id: "username",
                type: "string",
                minLength: 3,
                maxLength: 50
            },
            password: {
                type: "string",
                minLength: 6,
                maxLength: 50
            },
        }
    },
    ajvInstance);
/*validateMiddleware.create({
    body: Joi.object({
        // TODO: data from config.
        username: Joi.string().alphanum().min(3).max(50).required(),
        password: Joi.string().min(6).max(30).required(),
    }),
})*/