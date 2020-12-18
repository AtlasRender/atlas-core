/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
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
import {getConnection, getRepository, In} from "typeorm";
import {IncludeUsernameInQueryValidator} from "../validators/UserRequestValidators";
import {findOneOrganizationByRequestParams} from "../middlewares/organizationRequestMiddlewares";
import {canManageUsers} from "../middlewares/withRoleAccessMiddleware";
import Role from "../entities/Role";
import {UserPermissions, UserWithPermissions} from "../interfaces/UserWithPermissions";


/**
 * @function
 * addUsersToOrg - for each userId provided in userIds, finds and adds user to organization.
 * @param userIds - array of user ids.
 * @param org - organization, where users will be added.
 * @author Denis Afendikov
 */
const addUsersToOrg = async (userIds: number[], org: Organization): Promise<void> => {
    let errors = [];
    const users = await User.find({
        where: {
            id: In(userIds)
        },
        relations: ["roles"]
    });
    for (const userId of userIds) {
        const addUser = users.find(user => user.id === userId);
        if (!addUser) {
            throw new RequestError(404, "User not exist.", {errors: {notExist: userId}});
        }
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
};

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
        this.post(
            "/:organization_id/users",
            IncludeUserIdsInBodyValidator,
            findOneOrganizationByRequestParams({relations: ["users", "ownerUser", "defaultRole"]}),
            canManageUsers,
            this.addOrganizationUsers
        );
        this.delete(
            "/:organization_id/users",
            IncludeUserIdsInBodyValidator,
            findOneOrganizationByRequestParams({relations: ["users", "ownerUser"]}),
            canManageUsers,
            this.deleteOrganizationUsers
        );

        this.get("/:organization_id/availableUsers", IncludeUsernameInQueryValidator, this.getAvailableUsers);

        this.get("/:organization_id/users/:user_id", this.getOrgUserById);

        this.get(
            "/:organization_id/users/:user_id/permissions",
            findOneOrganizationByRequestParams({relations: ["users", "ownerUser"]}),
            this.getUserPermissions
        );

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
        // TODO: re-edit all with transactions.

        if (await Organization.findOne({name: ctx.request.body.name})) {
            throw new RequestError(409, "Organization with this name already exists.", {errors: {organization: 409}});
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

        const savedOrg = await organization.save();

        let defaultRole = new Role();
        if(ctx.request.body.defaultRole) {
            const defaultRoleData = ctx.request.body.defaultRole;
            defaultRole.name = defaultRoleData.name;
            defaultRole.description = defaultRoleData.description || "Default user role.";
            defaultRole.color = defaultRoleData.color || "#090";
            defaultRole.permissionLevel = defaultRoleData.permissionLevel;
            defaultRole.canManageUsers = defaultRoleData.canManageUsers;
            defaultRole.canManageRoles = defaultRoleData.canManageRoles;
            defaultRole.canCreateJobs = defaultRoleData.canCreateJobs;
            defaultRole.canDeleteJobs = defaultRoleData.canDeleteJobs;
            defaultRole.canEditJobs = defaultRoleData.canEditJobs;
            defaultRole.canManagePlugins = defaultRoleData.canManagePlugins;
            defaultRole.canManageTeams = defaultRoleData.canManageTeams;
        } else {
            defaultRole.name = "user";
            defaultRole.description = "Default user role.";
            defaultRole.color = "#090";
            defaultRole.permissionLevel = 0;
            defaultRole.canManageUsers = false;
            defaultRole.canManageRoles = false;
            defaultRole.canCreateJobs = true;
            defaultRole.canDeleteJobs = false;
            defaultRole.canEditJobs = false;
            defaultRole.canManagePlugins = true;
            defaultRole.canManageTeams = true;
        }
        defaultRole.organization = savedOrg;
        await defaultRole.save();

        await getConnection()
            .createQueryBuilder()
            .relation(Organization, "defaultRole")
            .of(savedOrg)
            .set(defaultRole);


        // add roles from body
        if (ctx.request.body.roles) {
            for (const roleData of ctx.request.body.roles) {
                const roleNamesSet = new Set(ctx.request.body.roles.map(role => role.name));
                if(roleData.name === defaultRole.name || roleNamesSet.size !== ctx.request.body.roles.length) {
                    throw new RequestError(409, "Conflicting role names.", {errors: {roles: 409}});
                }
                let role = new Role();
                role.name = roleData.name;
                role.description = roleData.description;
                role.color = roleData.color || "black"; // TODO random color
                role.permissionLevel = roleData.permissionLevel;
                role.organization = savedOrg;
                role.canManageUsers = roleData.canManageUsers;
                role.canManageRoles = roleData.canManageRoles;
                role.canCreateJobs = roleData.canCreateJobs;
                role.canDeleteJobs = roleData.canDeleteJobs;
                role.canEditJobs = roleData.canEditJobs;
                role.canManagePlugins = roleData.canManagePlugins;
                role.canManageTeams = roleData.canManageTeams;
                role.canEditAudit = roleData.canEditAudit;
                await role.save();
            }
        }

        // add users from body
        if (ctx.request.body.userIds) {
            await addUsersToOrg(ctx.request.body.userIds, savedOrg);
        }

        ctx.body = {
            success: true,
            organizationId: savedOrg.id
        };
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
            .leftJoin("org.roles", "role")
            .leftJoin("org.defaultRole", "defaultRole")
            .select([
                "org",
                "ownerUser.id", "ownerUser.username",
                "user.id", "user.username",
                "role.id", "role.name", "role.color", "defaultRole.id", "defaultRole.name",
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
        if (ctx.request.body.name && ctx.request.body.name !== org.name) {
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
        const org = await Organization.findOne(ctx.params.organization_id, {relations: ["ownerUser"]});
        if (!org) {
            throw new RequestError(404, "Organization not found.");
        }
        if (ctx.state.user.id !== org.ownerUser.id) {
            throw new RequestError(403, "Forbidden.");
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
            throw new RequestError(404, "Organization not found.");
        }
        ctx.body = org.users;
    }

    /**
     * Route __[POST]__ ___/organizations/:organization_id/users___ - add users to organization.
     * @method
     * @author Denis Afendikov
     */
    public async addOrganizationUsers(ctx: Context) {
        const org = ctx.state.organization;
        await addUsersToOrg(ctx.request.body.userIds, org);
        ctx.body = {success: true};
    }

    /**
     * Route __[DELETE]__ ___/organizations/:organization_id/users___ - delete users from organization.
     * @method
     * @author Denis Afendikov
     */
    public async deleteOrganizationUsers(ctx: Context) {
        const org = ctx.state.organization;
        let errors = [];
        const users = await User.find({
            where: {
                id: In(ctx.request.body.userIds)
            },
            relations: ["roles", "roles.organization"]
        });
        ctx.request.body.userIds.forEach(userId => {
            if (!users.find(user => user.id === userId)) {
                throw new RequestError(404, "User not exist.", {errors: {notExist: userId}});
            }
        });

        let usersToDelete = [];
        for (const deleteUser of users) {
            // TODO: CHECK PERMISSION LEVEL OF USER TO DELETE.
            // TODO: if ownerUser deleted - set new user by role permissionLevel.
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
        // TODO: if all users removed - remove organization ???
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
        const user: UserWithPermissions = await getRepository(User)
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
        if (!user) {
            throw new RequestError(404, "User not found in this organization",
                {errors: {user: 404}});
        }
        user.permissions = user.roles.reduce((perms, role) => ({
                canManageUsers: (role.canManageUsers && perms.canManageUsers < role.permissionLevel) ? role.permissionLevel : perms.canManageUsers,
                canManageRoles: (role.canManageRoles && perms.canManageRoles < role.permissionLevel) ? role.permissionLevel : perms.canManageRoles,
                canCreateJobs: (role.canCreateJobs && perms.canCreateJobs < role.permissionLevel) ? role.permissionLevel : perms.canCreateJobs,
                canDeleteJobs: (role.canDeleteJobs && perms.canDeleteJobs < role.permissionLevel) ? role.permissionLevel : perms.canDeleteJobs,
                canEditJobs: (role.canEditJobs && perms.canEditJobs < role.permissionLevel) ? role.permissionLevel : perms.canEditJobs,
                canManagePlugins: (role.canManagePlugins && perms.canManagePlugins < role.permissionLevel) ? role.permissionLevel : perms.canManagePlugins,
                canManageTeams: (role.canManageTeams && perms.canManageTeams < role.permissionLevel) ? role.permissionLevel : perms.canManageTeams,
                canEditAudit: (role.canEditAudit && perms.canEditAudit < role.permissionLevel) ? role.permissionLevel : perms.canEditAudit
            }),
            {
                canManageUsers: -1,
                canManageRoles: -1,
                canCreateJobs: -1,
                canDeleteJobs: -1,
                canEditJobs: -1,
                canManagePlugins: -1,
                canManageTeams: -1,
                canEditAudit: -1
            }
        );

        ctx.body = user;
    }

    /**
     * Route __[GET]__ ___/organizations/:organization_id/users/:user_id/permissions___ - get user permissions in organization.
     * @method
     * @author Denis Afendikov
     */
    public async getUserPermissions(ctx: Context) {
        const org = ctx.state.organization;
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
        if (!user) {
            throw new RequestError(404, "User not found in this organization",
                {errors: {user: 404}});
        }

        const permissions: UserPermissions = user.roles.reduce((perms, role) => ({
                canManageUsers: (role.canManageUsers && perms.canManageUsers < role.permissionLevel) ? role.permissionLevel : perms.canManageUsers,
                canManageRoles: (role.canManageRoles && perms.canManageRoles < role.permissionLevel) ? role.permissionLevel : perms.canManageRoles,
                canCreateJobs: (role.canCreateJobs && perms.canCreateJobs < role.permissionLevel) ? role.permissionLevel : perms.canCreateJobs,
                canDeleteJobs: (role.canDeleteJobs && perms.canDeleteJobs < role.permissionLevel) ? role.permissionLevel : perms.canDeleteJobs,
                canEditJobs: (role.canEditJobs && perms.canEditJobs < role.permissionLevel) ? role.permissionLevel : perms.canEditJobs,
                canManagePlugins: (role.canManagePlugins && perms.canManagePlugins < role.permissionLevel) ? role.permissionLevel : perms.canManagePlugins,
                canManageTeams: (role.canManageTeams && perms.canManageTeams < role.permissionLevel) ? role.permissionLevel : perms.canManageTeams,
                canEditAudit: (role.canEditAudit && perms.canEditAudit < role.permissionLevel) ? role.permissionLevel : perms.canEditAudit
            }),
            {
                canManageUsers: -1,
                canManageRoles: -1,
                canCreateJobs: -1,
                canDeleteJobs: -1,
                canEditJobs: -1,
                canManagePlugins: -1,
                canManageTeams: -1,
                canEditAudit: -1
            }
        );

        ctx.body = permissions;
    }
}