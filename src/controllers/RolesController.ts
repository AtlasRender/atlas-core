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
import {OrganizationRegisterValidator, RoleAddValidator} from "../validators/OrganizationRequestValidators";
import Role from "../entities/Role";
import Organization from "../entities/Organization";
import RequestError from "../errors/RequestError";


/**
 * RolesController - controller for /organization/:org_id/roles routes.
 * @class
 * @author Denis Afendikov
 */
export default class RolesController extends Controller {
    constructor() {
        super(":organization_id/roles");

        this.get("/", this.getRoles);
        this.post("/roles", RoleAddValidator, this.addRole);

        this.delete("/:role_id", this.deleteRole);


    }

    /**
     * Route __[GET]__ ___/:org_id/roles - get information about all organization's roles.
     * @method
     * @author Denis Afendikov
     */
    public async getRoles(ctx: Context): Promise<void> {
        const org = await Organization.findOne(ctx.params.organizations_id);
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
        const org: Organization = await Organization.findOne(ctx.params.organizations_id);
        if (!org) {
            throw new RequestError(404, "Not found.");
        }
        // TODO: check name uniqueness

        // TODO: users who have permission to add roles
        if(ctx.state.user.id !== org.ownerUser.id) {
            throw new RequestError(404, "Not found.");
        }

        let role = new Role();
        role.name = ctx.body.name;
        role.description = ctx.body.description;
        role.color = ctx.body.color;
        role.permissionLevel = ctx.body.permissionLevel;
        role.organization = org;
        ctx.body = await role.save();
    }

    /**
     * Route __[DELETE]__ ___/:org_id/roles/:role_id - get information about all organization's roles.
     * @method
     * @author Denis Afendikov
     */
    public async deleteRole(ctx: Context): Promise<void> {
        const org: Organization = await Organization.findOne(ctx.params.organizations_id);
        if (!org) {
            throw new RequestError(404, "Organization not found.");
        }

        const role: Role = await Role.findOne(ctx.params.role_id);
        if(!role) {
            throw new RequestError(404, "Role not found.");
        }

        ctx.body = await role.remove();
    }
}