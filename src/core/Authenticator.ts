/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10/6/20, 5:13 PM
 * All rights reserved.
 */

import * as Koa from "koa";
import {Context} from "koa";
import * as cryptoRandomString from "crypto-random-string";
import * as Jwt from "koa-jwt";
import * as jsonwebtoken from "jsonwebtoken";
import {Moment} from "moment";
import moment = require("moment");

export interface UserJwt {
    /**
     * username - user username.
     */
    username: string;
    /**
     * userId - user id.
     */
    userId: number;
    /**
     * expires - expiration timestamp of the token.
     */
    expires: string;
    /**
     * createdAt - timestamp when token was created.
     */
    createdAt: string;
}

export interface JwtOptions {
    /**
     * expires - expiration timestamp of the token.
     */
    expires?: Moment;
}

export default class Authenticator {
    /**
     * key - private key for token generating.
     */
    public static readonly key = cryptoRandomString({length: 30, type: "base64"});

    /**
     * jwtMiddleware - Jwt middleware.
     */
    protected static jwtMiddleware: Koa.Middleware = null;

    /**
     * init - initializes Authenticator.
     * @method
     * @author Danil Andreev
     */
    public static init() {
        Authenticator.jwtMiddleware = Jwt({
            secret: Authenticator.key,
            isRevoked: Authenticator.checkTokenRevoked,
        }).unless({path: [/^\/login/, "/users"]});
    }

    /**
     * checkTokenRevoked - returns false when token is not revoked ant true if it is.
     * @method
     * @param ctx - Context
     * @param decodedToken - Decoded jwt token
     * @param token - Raw jwt token
     */
    protected static async checkTokenRevoked(ctx: Context, decodedToken: UserJwt, token: string): Promise<boolean> {
        return false;
    }

    /**
     * getJwtMiddleware - returns Jwt middleware for Koa.
     * @method
     * @author Danil Andreev
     */
    public static getJwtMiddleware(): Koa.Middleware {
        return this.jwtMiddleware;
    }

    /**
     * createJwt - creates token from payload.
     * @method
     * @param data - Data to encrypt. Payload.
     * @param options - Additional options.
     * @author Danil Andreev
     */
    public static createJwt(data: object, options: JwtOptions = {}): string {
        const createdAt: Moment = moment();
        if (options?.expires < createdAt)
            throw new RangeError(`Authenticator: "expires" can not be less than "createdAt"`);
        const expires: Moment = options.expires ? options.expires.add(1, "hour") : createdAt.add(1, "hour");
        const token: string = jsonwebtoken.sign({
            ...data,
            expires: expires.format(),
            createdAt: createdAt.format()
        }, Authenticator.key);
        return token;
    }
}

Authenticator.init();