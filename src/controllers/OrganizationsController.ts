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
import Organization from "../entities/Organization";
import {
    OrganizationRegisterValidator,
    OrganizationUserAddDeleteValidator
} from "../validators/OrganizationRequestValidators";
import RolesController from "./RolesController";
import User from "../entities/User";
import RequestError from "../errors/RequestError";
import {getRepository} from "typeorm";


/**
 * OrganizationController - controller for /organization routes.
 * @class
 * @author Denis Afendikov
 */
export default class OrganizationsController extends Controller {
    constructor() {
        super("/organizations");

        this.get("/", this.getOrganizations);
        this.post("/", OrganizationRegisterValidator, this.addOrganization);
        this.get("/:organization_id", this.getOrganizationById);
        // TODO: POST == edit
        this.delete("/:organization_id", this.deleteOrganizationById);

        this.get("/:organization_id/users", this.getOrganizationUsers);
        this.post("/:organization_id/users", OrganizationUserAddDeleteValidator, this.addOrganizationUser);
        // body == {users: [ids]}
        this.delete("/:organization_id/users", OrganizationUserAddDeleteValidator, this.deleteOrganizationUser);

        // connect RolesController
        const rolesController = new RolesController();
        this.use(rolesController.baseRoute, rolesController.routes(), rolesController.allowedMethods());


    }

    /**
     * Route __[GET]__ ___/organizations___ - get information about all organizations in the system.
     * @method
     * @author Denis Afendikov
     */
    public async getOrganizations(ctx: Context): Promise<void> {
        const orgs = await getRepository(Organization)
            .createQueryBuilder("org")
            .leftJoin("org.ownerUser", "ownerUser")
            .select(["org", "ownerUser.id", "ownerUser.username"])
            .getMany();
        ctx.body = orgs;
    }

    /**
     * Route __[POST]__ ___/organizations___ - register new organization.
     * @method
     * @author Denis Afendikov
     */
    public async addOrganization(ctx: Context): Promise<void> {
        if (await Organization.findOne({name: ctx.request.body.name})) {
            ctx.throw(400, "org with this name already exists");
        }

        // TODO: uniqueness

        const authUser: User = await User.findOne(ctx.state.user.id);
        if (!authUser) {
            throw new RequestError(403, "Forbidden.");
        }

        let organization = new Organization();
        organization.ownerUser = authUser;
        organization.name = ctx.request.body.name;
        organization.description = ctx.request.body.description;
        organization.users = [authUser];
        ctx.body = await organization.save();
    }

    /**
     * Route __[GET]__ ___/organizations/:organization_id___ - get information about organization.
     * @method
     * @author Denis Afendikov
     */
    public async getOrganizationById(ctx: Context): Promise<void> {
        const org = await getRepository(Organization)
            .createQueryBuilder("org")
            .where("org.id = :id", {id: ctx.params.organization_id})
            .leftJoin("org.ownerUser", "ownerUser")
            .leftJoin("org.users", "user")
            .select([
                "org",
                "ownerUser.id", "ownerUser.username",
                "user.id", "user.username"
            ])
            .getOne();

        if (!org) {
            throw new RequestError(404, "Not found.");
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
            ctx.throw(403);
        }
        ctx.body = await Organization.delete(org.id);
    }


    /**
     * Route __[GET]__ ___/organizations/:organization_id/users___ - get all organization users.
     * @method
     * @author Denis Afendikov
     */
    public async getOrganizationUsers(ctx: Context): Promise<void> {

        const org = await getRepository(Organization)
            .createQueryBuilder("org")
            .where("org.id = :id", {id: ctx.params.organization_id})
            .leftJoin("org.users", "user")
            .select([
                "org", "user.id", "user.username"
            ])
            .getOne();
        if (!org) {
            ctx.throw(404);
        }
        ctx.body = org.users;
    }

    /**
     * Route __[POST]__ ___/organizations/:organization_id/users___ - add user to organization.
     * @method
     * @author Denis Afendikov
     */
    public async addOrganizationUser(ctx: Context) {
        const org = await Organization.findOne(ctx.params.organizations_id, {relations: ["users"]});
        if (!org) {
            ctx.throw(404);
        }

        // TODO: checking if logged user has permissions to add new user

        const addUser: User = await User.findOne(ctx.request.body.userId, {relations: ["roles"]});
        if (!addUser) {
            throw new RequestError(400, "User not exists.");
        }

        // if user already in org
        if (org.users.map(usr => usr.id).indexOf(addUser.id) !== -1) {
            // TODO: determine code
            throw new RequestError(403, "User already in organisation");
        }

        addUser.roles.push(org.defaultRole);
        try {
            await addUser.save();
        } catch (err) {
            // TODO
        }

        org.users.push(addUser);
        try {
            await org.save();
        } catch (err) {
            // TODO
        }
        ctx.body = {success: true};
    }

    /**
     * Route __[DELETE]__ ___/organizations/:organization_id/users___ - add user to organization.
     * @method
     * @author Denis Afendikov
     */
    public async deleteOrganizationUser(ctx: Context) {
        const org = await Organization.findOne(ctx.params.organizations_id, {relations: ["users"]});
        if (!org) {
            ctx.throw(404);
        }
        // TODO: checking if logged user has permissions to delete new user

        const deleteUser = await User.findOne(ctx.request.body.userId, {relations: ["roles"]});
        if (!deleteUser) {
            throw new RequestError(400, "User not exists.");
        }

        // if user not in org
        if (org.users.map(usr => usr.id).indexOf(deleteUser.id) === -1) {
            // TODO: determine code
            throw new RequestError(401, "User not in organisation");
        }

        deleteUser.roles = deleteUser.roles.filter((elem) => {
            return elem.organization.id === org.id;
        });

        org.users = org.users.filter(user => user.id !== deleteUser.id);

        await deleteUser.save();
        await org.save();

        ctx.body = {success: true};
    }
}
