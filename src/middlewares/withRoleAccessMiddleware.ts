/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: atlas-core
 * File last modified: 05.11.2020, 18:17
 * All rights reserved.
 */

import {Context, Middleware, Next} from "koa";
import {getRepository} from "typeorm";
import User from "../entities/User";
import RequestError from "../errors/RequestError";


/**
 * canManageRoles - Koa.Middleware for checking if logged user has permission to manage roles.
 * @param ctx - Context
 * @param next - Next
 */
export const canManageRoles: Middleware = async (ctx: Context, next: Next) => {
    const user = await getRepository(User)
        .createQueryBuilder("user")
        .where({id: ctx.state.user.id})
        .leftJoinAndSelect("user.organizations", "userOrg", "userOrg.id = :orgId",
            {orgId: ctx.state.organization.id})
        .leftJoinAndSelect("user.roles", "userRole", "userRole.id = userOrg.id")
        .getOne();

    // check if user is part of this organization
    if (!user.organizations.length) {
        throw new RequestError(403, "You are not a member of this organization.");
    }

    const canManageRoles = user.roles.some(role => role.canManageRoles);

    // check if user has permission to add roles
    if (!canManageRoles && user.id !== ctx.state.organization.ownerUser.id) {
        throw new RequestError(403, "Forbidden.");
    }

    await next();
};