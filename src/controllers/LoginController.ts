/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import * as argon2 from "argon2";

import User from "../entities/User";
import {UserLoginValidator} from "../validators/UserRequestValidators";
import Authenticator from "../core/Authenticator";
import OutUser from "../interfaces/OutUser";
import RequestError from "../errors/RequestError";


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
        const user = await User.findOne({username: ctx.request.body.username}, {relations: ["privateData"]});
        if (!user) {
            throw new RequestError(404, "User with this username not exist.",
                {errors: {notExist: "username"}});
        }
        if (!await argon2.verify(user.privateData.password, ctx.request.body.password)) {
            throw new RequestError(401, "Password incorrect.");
        }

        const result: OutUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            deleted: user.deleted,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            bearer: await Authenticator.createJwt({id: user.id, username: user.username})
        };
        ctx.body = result;

    }
}
