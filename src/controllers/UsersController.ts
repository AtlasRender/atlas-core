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
import {UserRegisterValidator} from "../validators/UserRequestValidator";
import Authenticator from "../core/Authenticator";
import {HttpError} from "koa";

import OutUser from "../interfaces/OutUser";

/**
 * UsersController - controller for /users and /users/:user_id routes.
 * @class
 * @author Denis Afendikov
 */
export default class UsersController extends Controller {
    constructor() {
        super("/users");

        this.get("/", this.getAllUsers);
        this.post("/", UserRegisterValidator, this.registerUser);
        this.get("/:user_id", this.getUserById);


    }

    /**
     * Route __[GET]__ ___/users___ - get information about all users in the system.
     * @method
     * @author Denis Afendikov
     */
    public async getAllUsers(ctx: Context): Promise<void> {
        ctx.body = await User.find({
            select: ["id", "username", "email", "deleted", "createdAt", "updatedAt"]
        });
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

        const user = new User();
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
            bearer: Authenticator.createJwt({id: savedUser.id, username: savedUser.username})
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
        // TODO: if not found, return 404
        const user = await User.findOne(ctx.params.user_id, {
            select: ["id", "username", "email", "deleted", "createdAt", "updatedAt"]
        });
        if(!user) {
            ctx.throw(404);
        }

        ctx.body = user;
    }
}
