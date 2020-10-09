/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 06.10.2020, 23:20
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import * as argon2 from "argon2";

import User from "../entities/User";
import {UserLoginValidator} from "../validators/UserRequestValidators";
import Authenticator from "../core/Authenticator";
import OutUser from "../interfaces/OutUser";


/**
 * UsersController - controller for /users and /users/:user_id routes.
 * @class
 * @author Denis Afendikov
 */
export default class LoginController extends Controller {
    constructor() {
        super("/login");
        this.post("/", UserLoginValidator, this.loginHandler);
    }

    /**
     * Route __[POST]__ ___/login___ - handler for user login.
     * @method
     * @author Denis Afendikov
     */
    public async loginHandler(ctx: Context): Promise<void> {
        const user = await User.findOne({username: ctx.request.body.username});
        if (!user) {
            ctx.throw(401, "user with this username not exist");
        }
        if (await argon2.verify(user.password, ctx.request.body.password)) {
            const result: OutUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                deleted: user.deleted,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                bearer: Authenticator.createJwt({id: user.id, username: user.username})
            };
            ctx.body = result;
        } else {
            ctx.throw(401, "password incorrect");
        }

    }
}
