/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 06.10.2020, 20:52
 * All rights reserved.
 */

import * as Joi from "joi";
import * as validateMiddleware from "koa-joi-validate-middleware";

/**
 * RegisterUserValidator - validator for user registration request.
 * @author Denis Afendikov
 */
export const UserRegisterValidator = validateMiddleware.create({
    body: Joi.object({
        // TODO: data from config.
        username: Joi.string().alphanum().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
    }),
});

/**
 * LoginUserValidator - validator for user l request.
 * @author Denis Afendikov
 */
export const UserLoginValidator = validateMiddleware.create({
    body: Joi.object({
        // TODO: data from config.
        username: Joi.string().alphanum().min(3).max(50).required(),
        password: Joi.string().min(6).max(30).required(),
    }),
});