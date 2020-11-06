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
import Role from "../entities/Role";


/**
 * findLoggedUser - find current logged user in context of organization
 * @param ctx - Context
 */
const findLoggedUser = async (ctx: Context): Promise<User> => {
    const user: User = await getRepository(User)
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
    return user;
};

/**
 * withRoleAccessOrOwner - utility function, used for checking role access.
 * @param rolePredicate - predicate used in __roles.some()__. Specifies the field on which checking will be based.
 */
const withRoleAccessOrOwner = (
    rolePredicate: (value: Role, index: number, array: Role[]) => unknown
): Middleware =>
    async (ctx: Context, next: Next): Promise<void> => {
        const user = await findLoggedUser(ctx);
        const hasAccess = user.roles.some(rolePredicate);
        // check if user has permission for this
        if (!hasAccess && user.id !== ctx.state.organization.ownerUser.id) {
            throw new RequestError(403, "Forbidden.");
        }
        await next();
    };

/**
 * canManageRoles - Koa.Middleware for checking if logged user has permission to manage roles.
 * @param ctx - Context
 * @param next - Next
 */
export const canManageRoles: Middleware = withRoleAccessOrOwner(role => role.canManageRoles);

/**
 * canManageUsers - Koa.Middleware for checking if logged user has permission to manage users.
 * @param ctx - Context
 * @param next - Next
 */
export const canManageUsers: Middleware = withRoleAccessOrOwner(role => role.canManageUsers);

/**
 * canManageTeams - Koa.Middleware for checking if logged user has permission to manage teams.
 * @param ctx - Context
 * @param next - Next
 */
export const canManageTeams: Middleware = withRoleAccessOrOwner(role => role.canManageTeams);

/**
 * canManagePlugins - Koa.Middleware for checking if logged user has permission to manage plugins.
 * @param ctx - Context
 * @param next - Next
 */
export const canManagePlugins: Middleware = withRoleAccessOrOwner(role => role.canManagePlugins);

/**
 * canCreateJobs - Koa.Middleware for checking if logged user has permission to create jobs.
 * @param ctx - Context
 * @param next - Next
 */
export const canCreateJobs: Middleware = withRoleAccessOrOwner(role => role.canCreateJobs);

/**
 * canEditJobs - Koa.Middleware for checking if logged user has permission to edit jobs.
 * @param ctx - Context
 * @param next - Next
 */
export const canEditJobs: Middleware = withRoleAccessOrOwner(role => role.canEditJobs);

/**
 * canDeleteJobs - Koa.Middleware for checking if logged user has permission to delete jobs.
 * @param ctx - Context
 * @param next - Next
 */
export const canDeleteJobs: Middleware = withRoleAccessOrOwner(role => role.canDeleteJobs);