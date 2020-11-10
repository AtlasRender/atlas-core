/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 06.10.2020, 17:50
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import * as argon2 from "argon2";

import User from "../entities/User";
import {
    IncludeUsernameInQueryValidator,
    PasswordInBodyValidator,
    UserEditValidator,
    UserRegisterValidator
} from "../validators/UserRequestValidators";
import Authenticator from "../core/Authenticator";

import OutUser from "../interfaces/OutUser";
import {getRepository} from "typeorm";
import RequestError from "../errors/RequestError";


/**
 * UsersController - controller for /users and /users/:user_id routes.
 * @class
 * @author Denis Afendikov
 */
export default class UsersController extends Controller {
    constructor() {
        super("/users");

        this.get("/", IncludeUsernameInQueryValidator, this.getAllUsers);
        this.post("/", UserRegisterValidator, this.registerUser);

        this.get("/:user_id", this.getUserById);
        this.post("/:user_id", UserEditValidator, this.editUser);
        this.delete("/:user_id", PasswordInBodyValidator, this.deleteUser);

        this.get("/:user_id/organizations", this.getUserOrganizations);
    }

    /**
     * Route __[GET]__ ___/users___ - get information about all users in the system.
     * @method
     * @author Denis Afendikov
     */
    public async getAllUsers(ctx: Context): Promise<void> {
        ctx.body = await getRepository(User)
            .createQueryBuilder("user")
            .where("user.username like :username",
                {username: `${ctx.request.query.username ?? ""}%`})
            .select([
                "user.id", "user.username", "user.email", "user.deleted", "user.createdAt", "user.updatedAt",
            ])
            .getMany();
    }

    /**
     * Route __[POST]__ ___/users___ - register new user.
     * @method
     * @author Denis Afendikov
     */
    public async registerUser(ctx: Context): Promise<void> {

        if (await User.findOne({username: ctx.request.body.username})) {
            ctx.throw(400, "user with this username already exists");
        }
        if (await User.findOne({email: ctx.request.body.email})) {
            ctx.throw(400, "user with this email already exists");
        }

        let user = new User();
        user.username = ctx.request.body.username;
        user.email = ctx.request.body.email;
        user.password = await argon2.hash(ctx.request.body.password);
        const savedUser = await user.save();
        const result: OutUser = {
            id: savedUser.id,
            username: savedUser.username,
            email: savedUser.email,
            deleted: savedUser.deleted,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
            bearer: await Authenticator.createJwt({id: savedUser.id, username: savedUser.username})
        };
        ctx.body = result;
    }

    /**
     * Route __[GET]__ ___/users/:user_id___ - get information about user by id.
     * @method
     * @author Denis Afendikov
     */
    public async getUserById(ctx: Context): Promise<void> {
        // TODO: check params for injections
        const user = await getRepository(User)
            .createQueryBuilder("user")
            .where({id: ctx.params.user_id})
            .leftJoin("user.organizations", "orgs")
            .select([
                    "user.id", "user.username", "user.email", "user.deleted", "user.createdAt", "user.updatedAt",
                    "orgs"
                ]
            )
            .getOne();

        // TODO: check organizations and split by owning / member
        if (!user) {
            throw new RequestError(404, "User not found.");
        }

        ctx.body = user;
    }

    /**
     * Route __[POST]__ ___/users/:user_id___ - edit user information.
     * @method
     * @author Denis Afendikov
     */
    public async editUser(ctx: Context): Promise<void> {
        let user = await User.findOne(ctx.params.user_id);
        if (!user) {
            throw new RequestError(404, "User not found.");
        }
        if (ctx.state.user.id !== user.id) {
            throw new RequestError(403, "Forbidden.");
        }
        if (!await argon2.verify(user.password, ctx.request.body.password)) {
            throw new RequestError(403, "Forbidden.", {errors: {password: "incorrect"}});
        }

        let errors = {};
        // if email changed
        if (ctx.request.body.email && ctx.request.body.email !== user.email) {
            if (await User.findOne({email: ctx.request.body.email})) {
                errors["email"] = "exists";
            } else {
                user.email = ctx.request.body.email;
            }
        }
        // if name changed
        if (ctx.request.body.username && ctx.request.body.username !== user.username) {
            if (await User.findOne({username: ctx.request.body.username})) {
                errors["username"] = "exists";
            } else {
                user.username = ctx.request.body.username;
            }
        }
        if (Object.keys(errors).length) {
            throw new RequestError(409, "Conflict user data.", {errors});
        }

        if (ctx.request.body.newPassword) {
            user.password = await argon2.hash(ctx.request.body.newPassword);
        }

        await user.save();
        ctx.body = {success: true};
    }

    /**
     * Route __[DELETE]__ ___/users/:user_id___ - delete user.
     * @method
     * @author Denis Afendikov
     */
    public async deleteUser(ctx: Context): Promise<void> {
        let user = await User.findOne(ctx.params.user_id);
        if (!user) {
            throw new RequestError(404, "User not found.");
        }
        if (ctx.state.user.id !== user.id) {
            throw new RequestError(403, "Forbidden.");
        }
        if (!await argon2.verify(user.password, ctx.request.body.password)) {
            throw new RequestError(403, "Forbidden.", {errors: {password: "incorrect"}});
        }

        user.deleted = true;
        await user.save();

        ctx.body = {success: true};
    }


    /**
     * Route __[GET]__ ___/users/:user_id/organizations___ - get information about all user organizations.
     * @method
     * @author Denis Afendikov
     */
    public async getUserOrganizations(ctx: Context): Promise<void> {
        const user = await getRepository(User)
            .createQueryBuilder("user")
            .where({id: ctx.params.user_id})
            .leftJoin("user.organizations", "orgs")
            .select([
                    "user.id", "user.username",
                    "orgs"
                ]
            )
            .getOne();

        // TODO: check organizations and split by owning / member
        if (!user) {
            throw new RequestError(404, "User not found.");
        }

        ctx.body = user.organizations;
    }
}
