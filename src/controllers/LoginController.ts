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
import {LoginUserValidator} from "../validators/UserRequestValidator";
import Authenticator from "../core/Authenticator";


/**
 * UsersController - controller for /users and /users/:user_id routes.
 * @class
 * @author Denis Afendikov
 */
export default class LoginController extends Controller {
    constructor() {
        super("/login");
        this.post("/", LoginUserValidator, this.loginHandler);
    }

    /**
     * Route __[POST]__ ___/login - handler for user login.
     * @method
     * @author Denis Afendikov
     */
    public async loginHandler(ctx: Context): Promise<void> {
        let user;
        if (!(user = await User.findOne({username: ctx.request.body.username}))) {
            throw {
                code: 401,
                message: "user with this username not exist"
            };
        }
        if(await argon2.verify(user.password, ctx.request.body.username)) {
            throw {
                code: 401,
                message: "password incorrect"
            };
        }

        user.bearer = Authenticator.createJwt({id: user.id, username: user.username});
        let result = await user.save();
        result.password = undefined;
        result.deleted = undefined;

        ctx.body = result;
    }
}
