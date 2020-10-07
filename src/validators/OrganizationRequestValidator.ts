/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 07.10.2020, 17:50
 * All rights reserved.
 */

import * as Joi from "joi";
import * as validateMiddleware from "koa-joi-validate-middleware";

export const OrganizationRegisterValidator = validateMiddleware.create({
    body: Joi.object({
        // TODO: data from config.
        name: Joi.string().alphanum().min(3).max(50).required(),
        description: Joi.string().max(500), //regex?: \^(?!\d)[a-zA-z\d ]+$\
    }),
});