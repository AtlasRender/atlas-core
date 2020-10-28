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
    IncludeUserIdsInBodyValidator,
    OrganizationEditValidator,
    OrganizationRegisterValidator
} from "../validators/OrganizationRequestValidators";
import RolesController from "./RolesController";
import User from "../entities/User";
import RequestError from "../errors/RequestError";
import {getRepository, In} from "typeorm";
import {IncludeUsernameInQueryValidator} from "../validators/UserRequestValidators";


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
        this.post("/:organization_id", OrganizationEditValidator, this.editOrganizationById);
        this.delete("/:organization_id", this.deleteOrganizationById);

        this.get("/:organization_id/users", this.getOrganizationUsers);
        // body == {userIds: [ids]}
        this.post("/:organization_id/users", IncludeUserIdsInBodyValidator, this.addOrganizationUsers);
        this.delete("/:organization_id/users", IncludeUserIdsInBodyValidator, this.deleteOrganizationUsers);

        this.get("/:organization_id/availableUsers", IncludeUsernameInQueryValidator, this.getAvailableUsers);

        this.get("/:organization_id/users/:user_id", this.getOrgUserById);

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

        const authUser: User = await User.findOne(ctx.state.user.id);
        if (!authUser) {
            throw new RequestError(401, "Unauthorized.");
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
     * Route __[POST]__ ___/organizations/:organization_id___ - edit information about organization.
     * @method
     * @author Denis Afendikov
     */
    public async editOrganizationById(ctx: Context): Promise<void> {
        let org = await Organization.findOne(ctx.params.organization_id);
        if (!org) {
            throw new RequestError(404, "Organization not found.");
        }
        if (ctx.state.user.id !== org.ownerUser.id) {
            throw new RequestError(403, "You are not owning this organization.");
        }
        if (ctx.request.body.name) {
            if (await Organization.findOne({name: ctx.request.body.name})) {
                throw new RequestError(409, "Organization with this name already exists.",
                    {errors: {name: "exists"}});
            } else {
                org.name = ctx.request.body.name;
            }
        }
        await org.save();

        ctx.body = {success: true};
    }

    /**
     * Route __[DELETE]__ ___/organizations/:organization_id___ - delete organization by id.
     * @method
     * @author Denis Afendikov
     */
    public async deleteOrganizationById(ctx: Context): Promise<void> {
        const org = await Organization.findOne(ctx.params.organization_id);
        if (!org) {
            ctx.throw(404);
        }
        if (ctx.state.user.id !== org.ownerUser.id) {
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
            .leftJoin("user.roles", "userRoles", "userRoles.organization = org.id")
            .orderBy({"userRoles.permissionLevel": "DESC"})
            .select([
                "org", "user.id", "user.username", "userRoles"
            ])
            .getOne();
        if (!org) {
            ctx.throw(404);
        }
        ctx.body = org.users;
    }

    /**
     * Route __[POST]__ ___/organizations/:organization_id/users___ - add users to organization.
     * @method
     * @author Denis Afendikov
     */
    public async addOrganizationUsers(ctx: Context) {
        const org = await Organization.findOne(ctx.params.organization_id, {relations: ["users", "ownerUser"]});
        if (!org) {
            ctx.throw(404);
        }

        // TODO: checking if logged user has permissions to add new user
        if (ctx.state.user.id !== org.ownerUser.id) {
            throw new RequestError(403, "You are not an owner.");
        }

        let errors = [];
        const users = await User.find({
            where: {
                id: In(ctx.request.body.userIds)
            },
            relations: ["roles"]
        });
        ctx.request.body.userIds.forEach(userId => {
            if (!users.find(user => user.id === userId)) {
                throw new RequestError(400, "User not exist.", {errors: {notExist: userId}});
            }
        });

        for (const addUser of users) {
            // if user already in org
            if (org.users.find(user => user.id === addUser.id)) {
                errors.push({present: addUser.id});
            } else {
                addUser.roles.push(org.defaultRole);
                org.users.push(addUser);

                await addUser.save();
            }
        }
        await org.save();

        if (errors.length) {
            throw new RequestError(409, "Some users are already in organization.", {errors});
        }
        ctx.body = {success: true};
    }

    /**
     * Route __[DELETE]__ ___/organizations/:organization_id/users___ - delete users from organization.
     * @method
     * @author Denis Afendikov
     */
    public async deleteOrganizationUsers(ctx: Context) {
        const org = await Organization.findOne(ctx.params.organization_id, {relations: ["users", "ownerUser"]});
        if (!org) {
            ctx.throw(404);
        }
        // checking if logged user has permissions to delete new user
        if (ctx.state.user.id !== org.ownerUser.id) {
            throw new RequestError(403, "You are not an owner.");
        }

        let errors = [];
        const users = await User.find({
            where: {
                id: In(ctx.request.body.userIds)
            },
            relations: ["roles"]
        });
        ctx.request.body.userIds.forEach(userId => {
            if (!users.find(user => user.id === userId)) {
                throw new RequestError(400, "User not exist.", {errors: {notExist: userId}});
            }
        });

        let usersToDelete = [];
        for (const deleteUser of users) {
            // if user not in org
            if (!org.users.find(usr => usr.id === deleteUser.id)) {
                errors.push({missing: deleteUser});
            } else {
                deleteUser.roles = deleteUser.roles.filter((role) => role.organization.id !== org.id);
                usersToDelete.push(deleteUser.id);
                await deleteUser.save();
            }
        }
        // [1, 2, 3] 3 - not in org
        // delete [1, 2], throw error
        // TODO: if all users removed - remove organization
        org.users = org.users.filter(usr => !usersToDelete.includes(usr.id));

        await org.save();

        if (errors.length) {
            throw new RequestError(409, "Some users are not in organization.", {errors});
        }

        ctx.body = {success: true};
    }

    /**
     * Route __[GET]__ ___/organizations/:organization_id/availableUsers___ - get users that are not in organization.
     * @method
     * @author Denis Afendikov
     */
    public async getAvailableUsers(ctx: Context) {
        const org = await Organization.findOne(ctx.params.organization_id, {relations: ["users", "ownerUser"]});
        if (!org) {
            throw new RequestError(404, "Organization not found.");
        }
        const users = await getRepository(User)
            .createQueryBuilder("user")
            //.innerJoin("user.organizations", "orgs", "orgs.id == :orgId", {orgId: +org.id})
            //.where(":orgId != orgs.id")
            .where("user.id NOT IN (:...userIds)", {userIds: org.users.map(u => u.id)})
            .andWhere("user.username like :username",
                {username: `${ctx.request.query.username ?? ""}%`})
            .select([
                "user.id", "user.username", "user.email", "user.deleted", "user.createdAt", "user.updatedAt",
            ])
            .getMany();

        ctx.body = users;
    }

    /**
     * Route __[GET]__ ___/organizations/:organization_id/users/:user_id___ - get user in context of organization.
     * @method
     * @author Denis Afendikov
     */
    public async getOrgUserById(ctx: Context) {
        const org = await Organization.findOne(ctx.params.organization_id, {relations: ["users", "ownerUser"]});
        if (!org) {
            throw new RequestError(404, "Organization not found.");
        }
        const user = await getRepository(User)
            .createQueryBuilder("user")
            .leftJoin("user.organizations", "userOrg", "userOrg.id = :orgId",
                {orgId: org.id})
            .where({id: ctx.params.user_id})
            .andWhere("userOrg.id = :orgId", {orgId: org.id})
            .leftJoin("user.roles", "userRoles", "userRoles.organization = :orgId",
                {orgId: org.id})
            .orderBy({"userRoles.permissionLevel": "DESC"})
            .select([
                "user.id", "user.username", "user.email", "user.deleted", "user.createdAt", "user.updatedAt",
                "userRoles"
            ])
            .getOne();
        if(!user) {
            throw new RequestError(404, "User not found in this organization",
                {errors: {user: 404}});
        }

        ctx.body = user;
    }
}
