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


/**
 * OrganizationController - controller for /organization routes.
 * @class
 * @author Denis Afendikov
 */
export default class OrganizationsController extends Controller {
    constructor() {
        super("/organizations");

        this.get("/", this.getOrganizations);
        this.post("/", this.createOrganization);

    }

    /**
     * Route __[GET]__ ___/organizations___ - get information about all organizations in the system.
     * @method
     * @author Denis Afendikov
     */
    public async getOrganizations(ctx: Context): Promise<void> {
        // TODO
    }

    /**
     * Route __[POST]__ ___/organizations___ - register new organization.
     * @method
     * @author Denis Afendikov
     */
    public async createOrganization(ctx: Context): Promise<void> {
        let orgs = Organization.find({
            select: ["id", "name", "description", "owner_user"]
        });
        ctx.body = orgs;
    }
}
