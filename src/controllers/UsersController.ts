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
import * as Joi from 'joi';
import * as validateMiddleware from "koa-joi-validate-middleware";
import * as argon2 from "argon2";

import User from "../entities/User";
import {ObjectType} from "typeorm";


const RegisterUserValidator = validateMiddleware.create({
    body: Joi.object({
        // TODO: data from config.
        username: Joi.string().alphanum().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
    }),
});

/**
 * UsersController - controller for /users and /users/:user_id routes.
 * @class
 * @author Denis Afendikov
 */
export default class UsersController extends Controller {
    constructor() {
        super("/users");

        this.post("/", RegisterUserValidator, this.registerUser);
        this.get("/:user_id", this.getUserById);


    }

    /**
     * Route __[POST]__ ___/users___ - register new user.
     * @method
     * @author Denis Afendikov
     */
    public async registerUser(ctx: Context): Promise<void> {

        let userData: ObjectType<User> = ctx.request.body;
        const user = new User();
        user.username = ctx.request.body.username;
        user.password = await argon2.hash(ctx.request.body.password);
        user.email = ctx.request.body.email || null;

        ctx.body = await user.save();
    }

    /**
     * Route __[GET]__ ___/users/:user_id___ - get information about user by id.
     * @method
     * @author Denis Afendikov
     */
    public async getUserById(ctx: Context): Promise<void> {
        // TODO: check params for injections
        // TODO: if not found, return 404
        const user = await User.findOne(ctx.params.user_id);
        console.log(user);
        ctx.body = user;
    }
}
