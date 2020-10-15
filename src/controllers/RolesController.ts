/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 12.10.2020, 22:38
 * All rights reserved.
 */


import Controller from "../core/Controller";
import {Context} from "koa";
import {
    IncludeBodyUserIdValidator,
    OrganizationRegisterValidator,
    RoleAddValidator
} from "../validators/OrganizationRequestValidators";
import Role from "../entities/Role";
import Organization from "../entities/Organization";
import RequestError from "../errors/RequestError";
import {getConnection, getRepository} from "typeorm";
import User from "../entities/User";


/**
 * RolesController - controller for /organization/:org_id/roles routes.
 * @class
 * @author Denis Afendikov
 */
export default class RolesController extends Controller {
    constructor() {
        super("/:organization_id/roles");

        this.get("/", this.getRoles);
        this.post("/", RoleAddValidator, this.addRole);

        this.delete("/:role_id", this.deleteRole);

        // users
        this.get("/:role_id/users", this.getRoleUsers);
        this.post("/:role_id/users", IncludeBodyUserIdValidator, this.addRoleUser);
        this.delete("/:role_id/users", IncludeBodyUserIdValidator, this.deleteRoleUser);
    }

    /**
     * Route __[GET]__ ___/:org_id/roles - get information about all organization's roles.
     * @method
     * @author Denis Afendikov
     */
    public async getRoles(ctx: Context): Promise<void> {
        //const org = await Organization.findOne(ctx.params.organization_id);
        const org: Organization = await getRepository(Organization)
            .createQueryBuilder("org")
            .where({id: ctx.params.organization_id})
            .leftJoinAndSelect("org.roles", "roles")
            .getOne();

        if (!org) {
            throw new RequestError(404, "Not found.");
        }

        ctx.body = org.roles;
    }

    /**
     * Route __[POST]__ ___/:org_id/roles - get information about all organization's roles.
     * @method
     * @author Denis Afendikov
     */
    public async addRole(ctx: Context): Promise<void> {
        const org: Organization = await Organization.findOne(ctx.params.organization_id, {relations: ["ownerUser"]});
        if (!org) {
            throw new RequestError(404, "Not found.");
        }
        // TODO: check name uniqueness

        // TODO: users who have permission to add roles
        if (ctx.state.user.id !== org.ownerUser.id) {
            throw new RequestError(404, "Not found.");
        }

        let role = new Role();
        role.name = ctx.request.body.name;
        role.description = ctx.request.body.description;
        role.color = ctx.request.body.color || "black"; // TODO random color
        role.permissionLevel = ctx.request.body.permissionLevel;
        role.organization = org;
        await role.save();
        ctx.body = {success: true};
    }

    /**
     * Route __[DELETE]__ ___/:org_id/roles/:role_id - get information about all organization's roles.
     * @method
     * @author Denis Afendikov
     */
    public async deleteRole(ctx: Context): Promise<void> {
        const org: Organization = await Organization.findOne(ctx.params.organization_id);
        if (!org) {
            throw new RequestError(404, "Organization not found.");
        }

        const role: Role = await Role.findOne(ctx.params.role_id);
        if (!role) {
            throw new RequestError(404, "Role not found.");
        }

        ctx.body = await role.remove();
    }

    /**
     * Route __[GET]__ ___/:org_id/roles/:role_id/users - get information about all users in organization's roles.
     * @method
     * @author Denis Afendikov
     */
    public async getRoleUsers(ctx: Context): Promise<void> {
        const org: Organization = await Organization.findOne(ctx.params.organization_id);
        if (!org) {
            throw new RequestError(404, "Organization not found.");
        }

        //const role: Role = await Role.findOne(ctx.params.role_id);
        const role: Role = await getRepository(Role)
            .createQueryBuilder("role")
            .where({id: ctx.params.role_id})
            .leftJoin("role.users", "users")
            .select(["role", "users.id", "users.username"])
            .getOne();

        if (!role) {
            throw new RequestError(404, "Role not found.");
        }

        ctx.body = role.users;
    }

    /**
     * Route __[POST]__ ___/:org_id/roles/:role_id/users - add user to organization's role.
     * @method
     * @author Denis Afendikov
     */
    public async addRoleUser(ctx: Context): Promise<void> {
        const org: Organization = await Organization.findOne(ctx.params.organization_id);
        if (!org) {
            throw new RequestError(404, "Organization not found.");
        }

        const role: Role = await Role.findOne(ctx.params.role_id, {relations: ["users"]});
        if (!role) {
            throw new RequestError(404, "Role not found.");
        }

        const addUser: User = await User.findOne(ctx.request.body.userId);
        if (!addUser) {
            throw new RequestError(404, "User not found");
        }

        // TODO: sql?
        if (role.users.map(usr => usr.id).indexOf(addUser.id) !== -1) {
            throw new RequestError(403, "User already owns this role.");
        }

        // TODO: check if user has permission to add roles

        role.users.push(addUser);
        await role.save();
        ctx.body = {success: true};
    }

    /**
     * Route __[DELETE]__ ___/:org_id/roles/:role_id/users - remove user from organization's role.
     * @method
     * @author Denis Afendikov
     */
    public async deleteRoleUser(ctx: Context): Promise<void> {
        const org: Organization = await Organization.findOne(ctx.params.organization_id);
        if (!org) {
            throw new RequestError(404, "Organization not found.");
        }

        const role: Role = await Role.findOne(ctx.params.role_id, {relations: ["users"]});
        if (!role) {
            throw new RequestError(404, "Role not found.");
        }

        const deleteUser: User = await User.findOne(ctx.request.body.userId);
        if (!deleteUser) {
            throw new RequestError(404, "User not found");
        }

        // TODO: check if user has permission to add roles

        if (role.users.map(usr => usr.id).indexOf(deleteUser.id) === 1) {
            throw new RequestError(403, "User does not own this role.");
        }

        ctx.body = await getConnection()
            .createQueryBuilder()
            .relation(Role, "users")
            .of(role)
            .remove(deleteUser);
    }
}