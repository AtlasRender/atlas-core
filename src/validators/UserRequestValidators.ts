/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 09.10.2020, 20:36
 * All rights reserved.
 */

import {ajvInstance} from "../globals";
import {bodyValidator, queryValidator} from "../utils/ajv-middleware/ajv-validation-middleware";

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
    },
    ajvInstance);

/**
 * LoginUserValidator - validator for user login request.
 * @author Denis Afendikov
 */
export const UserLoginValidator = bodyValidator({
        $id: "UserLoginValidator",
        type: "object",
        required: ["username", "password"],
        properties: {
            username: {
                // TODO: alphanumeric only
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

/**
 * UserEditValidator - validator for user edit request.
 * @author Denis Afendikov
 */
export const UserEditValidator = bodyValidator({
    $id: "UserEditValidator",
    type: "object",
    required: ["password"],
    properties : {
        username: {
            // TODO: alphanumeric only
            type: "string",
            minLength: 3,
            maxLength: 50
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 50
        },
        email: {
            type: "string",
            format: "email",
        },
        newPassword: {
            type: "string",
            minLength: 6,
            maxLength: 50
        }
    }
}, ajvInstance);

/**
 * PasswordInBodyValidator - validator for password in request body.
 * @author Denis Afendikov
 */
export const PasswordInBodyValidator = bodyValidator({
    $id: "PasswordInBodyValidator",
    type: "object",
    required: ["password"],
    properties : {
        password: {
            type: "string",
            minLength: 6,
            maxLength: 50
        }
    }
}, ajvInstance);

/**
 * IncludeBodyUserIdValidator - validator for body username field in request.
 * @author Denis Afendikov
 */
export const IncludeUsernameInQueryValidator = queryValidator({
    $id: "IncludeUsernameInBodyValidator",
    type: "object",
    // required: ["username"],
    properties: {
        username: {
            // TODO: alphanumeric only
            type: "string",
            // minLength: 3,
            maxLength: 50
        },
    }
}, ajvInstance);