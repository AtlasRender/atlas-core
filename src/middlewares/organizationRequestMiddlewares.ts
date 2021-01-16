/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import Organization from "../entities/typeorm/Organization";
import RequestError from "../errors/RequestError";
import {Context, Middleware, Next} from "koa";
import {FindOneOptions} from "typeorm/find-options/FindOneOptions";


/**
 * findOneOrganizationByRequestParams - middleware for finding organization by org_id params and attaching org entity to
 * __ctx.state.organization__
 * @param options - options to use in _typeorm's_ __findOne__ function.
 * @return Koa.Middleware
 * @author Denis Afendikov
 */
export const findOneOrganizationByRequestParams = (options?: FindOneOptions<Organization>): Middleware =>
    async (ctx: Context, next: Next) => {
        const org: Organization | undefined = await Organization.findOne(ctx.params.organization_id, options);
        if (!org) {
            throw new RequestError(404, "Not found.");
        }
        ctx.state.organization = org;
        await next();
    };

