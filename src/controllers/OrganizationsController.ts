/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 06.10.2020, 23:45
 * All rights reserved.
 */


import Controller from "../core/Controller";
import {Context} from "koa";

import User from "../entities/User";
import Authenticator from "../core/Authenticator";
import Organization from "../entities/Organization";
import {OrganizationRegisterValidator} from "../validators/OrganizationRequestValidator";


/**
 * OrganizationController - controller for /organization routes.
 * @class
 * @author Denis Afendikov
 */
export default class OrganizationsController extends Controller {
    constructor() {
        super("/organizations");

        this.get("/", this.getOrganizations);
        this.post("/", OrganizationRegisterValidator, this.createOrganization);
        this.get("/:organization_id", this.getOrganizationById);
        // TODO: POST == edit
        this.delete("/:organization_id", this.deleteOrganizationById);

    }

    /**
     * Route __[GET]__ ___/organizations___ - get information about all organizations in the system.
     * @method
     * @author Denis Afendikov
     */
    public async getOrganizations(ctx: Context): Promise<void> {
        /*const orgs = await Organization.find({
            relations: ["ownerUser"]
        });*/

        const orgs = await Organization.find();
        // TODO: NEEDS FIX! THIS IS SHIT
        for (let org of orgs) {
            delete org.ownerUser.password;
        }
        ctx.body = orgs;
    }

    /**
     * Route __[POST]__ ___/organizations___ - register new organization.
     * @method
     * @author Denis Afendikov
     */
    public async createOrganization(ctx: Context): Promise<void> {
        // TODO

        if (await Organization.findOne({name: ctx.request.body.name})) {
            ctx.throw(400, "org with this name already exists");
        }

        let organization = new Organization();
        organization.ownerUser = ctx.state.user;
        organization.name = ctx.request.body.name;
        organization.description = ctx.request.body.description;
        ctx.body = await organization.save();
    }

    /**
     * Route __[GET]__ ___/organizations/:organization_id___ - get information about organization.
     * @method
     * @author Denis Afendikov
     */
    public async getOrganizationById(ctx: Context): Promise<void> {
        const org = await Organization.findOne(ctx.params.organizations_id);
        if (!org) {
            ctx.throw(404);
        }
        ctx.body = org;
    }

    /**
     * Route __[DELETE]__ ___/organizations/:organization_id___ - delete organization by id.
     * @method
     * @author Denis Afendikov
     */
    public async deleteOrganizationById(ctx: Context): Promise<void> {
        const org = await Organization.findOne(ctx.params.organizations_id);
        if (!org) {
            ctx.throw(404);
        }
        if (ctx.state.user.id != org.ownerUser.id) {
            ctx.throw(401);
        }
        ctx.body = await Organization.delete(org.id);
    }
}
