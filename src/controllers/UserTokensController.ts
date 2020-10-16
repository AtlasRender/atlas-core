/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 15.10.2020, 20:36
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import * as CryptoRandomString from "crypto-random-string";
import UserJwt from "../interfaces/UserJwt";
import UserToken from "../entities/UserToken";
import User from "../entities/User";
import RequestError from "../errors/RequestError";
import {getRepository} from "typeorm";

// TODO: Add validators
export default class UserTokensController extends Controller {
    constructor() {
        super("/tokens");
        this.get("/", this.getAllTokens);
        this.post("/", this.createUserToken)
        this.delete("/:id", this.deleteToken);
    }

    /**
     * Route __[POST]__ ___/tokens___ - creates new token.
     * @method
     * @param ctx - HTTP Context
     * @author Danil Andreev
     */
    public async createUserToken(ctx: Context): Promise<void> {
        const user: UserJwt = ctx.state.user;
        const input = ctx.request.body;

        const {description, name} = input;

        // TODO: add token length from config.
        const token: string = CryptoRandomString({length: 30, type: "base64"});

        const owner = await User.findOne({where: {id: user.id}});

        const userToken = new UserToken();
        userToken.name = name;
        userToken.description = description;
        userToken.token = token;
        userToken.user = owner;
        const result = await userToken.save({});
        delete result.user;
        ctx.body = result;
    }

    /**
     * Route __[DELETE]__ ___/tokens___ - get array of all tokens.
     * @method
     * @param ctx - HTTP Context
     * @author Danil Andreev
     */
    public async deleteToken(ctx: Context): Promise<void> {
        const user: UserJwt = ctx.state.user;
        const id: number = +ctx.params.id;

        const token = await UserToken.findOne({where: {id}, relations: ["user"]});

        if (user.id !== token.user.id) {
            throw new RequestError(403, "You have no permissions to delete this token");
        }

        ctx.body = await UserToken.delete(token.id);
    }

    /**
     * Route __[GET]__ ___/tokens___ - get array of all tokens.
     * @method
     * @param ctx - HTTP Context
     * @author Danil Andreev
     */
    public async getAllTokens(ctx: Context) {
        const user: UserJwt = ctx.state.user;
        const tokens = await getRepository<UserToken>(UserToken)
            .createQueryBuilder("user_token")
            .select([
                "user_token.id",
                "user_token.name",
                "user_token.description",
                "user_token.createdAt"
            ])
            .where("user_token.user = :id", {id: user.id})
            .getMany();
        ctx.body = tokens;
    }
}